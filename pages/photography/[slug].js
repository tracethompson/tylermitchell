import Error from "next/error";
import { groq } from "next-sanity";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import ImageGallery from "../../components/ImageGallery";
import { urlFor, chunkImages } from "../../utils/sanity"
import { getClient, usePreviewSubscription } from "../../utils/sanity";
import { useState, useEffect } from "react";
import { getImageDimensions } from '@sanity/asset-utils'
import useWindowSize from '../../utils/useWindowSize'

const query = groq`*[_type == "photo" && slug.current == $slug][0]`;

const FullGrid = ({items, handleImgClick}) => {
  return (
  <div className="w-full lg:pt-8 px-4 mx-auto overflow-auto relative">
    <div className="flex flex-wrap max-w-full overflow-auto">
      {items.map(item => 
        <img
          className="h-48 md:px-4 mb-4 lg:mb-8 object-cover cursor-pointer"
          src={
            urlFor(item?.asset)
              .auto("format")
              .width(300) 
              .fit("max")
              .quality(100)
          }
          loading="lazy"
          onClick={() => handleImgClick(item)}
        />
      )}
    </div>
  </div>
  )
}
  
function PhotoContainer({ photoData, siteSettings, imageGrid, setGrid, setHighlight, highlightImage }) {
  
  const router = useRouter();
  if (!router.isFallback && !photoData?.slug) {
    return <Error statusCode={404} />;
  }

  const { data: film = {} } = usePreviewSubscription(query, {
    params: { slug: photoData?.slug?.current },
    initialData: photoData,
  });

  const {
    title,
    images,
    coverImage,
    slug
  } = film;


  const [[page, direction], setPage] = useState([0, 0])

  const [chunkedImages, setChunkedImages] = useState([])

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  const formattedImages = images?.map(img => {
    const {aspectRatio} = getImageDimensions(img.asset)
    return {
      src: urlFor(img.asset).auto("format").fit("max").width(800).quality(100),
      aspectRatio,
      _key: img._key,
      singular: img.singular
    }
  })

  useEffect(() => {
    formattedImages.forEach(img => new Image().src = img.src)
    const chunks = chunkImages(formattedImages)
    setChunkedImages(chunks)
  }, [])

  useEffect(() => {
    setGrid(false)
    setHighlight(null)
  }, [slug?.current])

  const { width } = useWindowSize()
  const notMobile = width > 850

  const handleImgClick = item => {
    // let idx = null
    // chunkedImages.forEach((chunk, i) => { 
    //   if (chunk[0]._key === item._key) idx = i

    //   if (idx === null && chunk[1]) {
    //     if (chunk[1]._key === item._key) idx = i
    //   }
    // }) 
    // const nD = idx > page ? -1 : 1
    // setGrid(false)
    // setPage([idx, nD])
    setHighlight(item)
  }

  const useGrid = notMobile

  return (
    <Layout highlightImage={highlightImage} setHighlight={setHighlight} imageGrid={imageGrid} setGrid={setGrid} useGrid={useGrid} title={title} siteSettings={siteSettings} currentTitle={title} coverImage={coverImage}>
      <div className={`w-full lg:pt-8 ${imageGrid && useGrid ? 'min-h-full' : 'h-full'}`}>
        <div className="relative w-full h-full flex content-center items-center">
          { useGrid && imageGrid ? 
            <FullGrid items={images} handleImgClick={handleImgClick} />
            : 
            <div className="h-full w-full lg:pt-8  px-4 lg:px-8 mx-auto flex content-center items-center relative">
              <ImageGallery images={chunkedImages} {...{page, direction, setPage, paginate}}/>
            </div>
          }
          { !useGrid || !imageGrid ?
            <div className="flex flex-row w-full h-full absolute top-0 left-0">
              <div className="w-1/2 cursor-pointer" onClick={() => paginate(-1)}/>
              <div className="w-1/2 cursor-pointer" onClick={() => paginate(1)}/>
            </div> : null
          }
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const photoData = await getClient(preview).fetch(query, {
    slug: params.slug,
  });

  const settingsQuery = `//groq
    *[_type == "siteConfig"]
  `
  const siteSettings = await getClient(true).fetch(settingsQuery);


  return {
    props: { preview, photoData, params, siteSettings },
  };
}

export async function getStaticPaths() {
  const paths = await getClient().fetch(
    `*[_type == "photo" && defined(slug.current)][].slug.current`
  );
  

  return {
    paths: paths?.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}

export default PhotoContainer;
