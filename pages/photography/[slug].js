import Error from "next/error";
import { groq } from "next-sanity";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import ImageGallery from "../../components/ImageGallery";
import { urlFor, chunkImages } from "../../utils/sanity"
import { getClient, usePreviewSubscription } from "../../utils/sanity";
import { useState, useEffect } from "react";
import { getImageDimensions } from '@sanity/asset-utils'

const query = groq`*[_type == "photo" && slug.current == $slug][0]`;
  
function PhotoContainer({ photoData, siteSettings }) {
  
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
    coverImage
  } = film;


  const [[page, direction], setPage] = useState([0, 0])

  const [chunkedImages, setChunkedImages] = useState([])

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  const formattedImages = images?.map(img => {
    const {aspectRatio} = getImageDimensions(img.asset)
    return {
      src: urlFor(img.asset).auto("format").fit("max").height(800).quality(100),
      aspectRatio,
    }
  })

  

  useEffect(() => {
    formattedImages.forEach(img => new Image().src = img.src)
    const chunks = chunkImages(formattedImages)
    setChunkedImages(chunks)
  }, [])

  // TODO MOBILE image gal wrapper THAT WORKS 'h-full w-full md:pt-8 pb-16 px-8 mx-auto flex content-center items-center relative'

  return (
    <Layout title={title} siteSettings={siteSettings} coverImage={coverImage}>
      <div className="w-full h-full md:pt-8 lg:pb-16">
        <div className="relative w-full h-full flex content-center items-center">
          <div className="h-full w-full md:pt-8 lg:pb-16 px-4 lg:px-8 mx-auto flex content-center items-center relative">
            <ImageGallery images={chunkedImages} {...{page, direction, setPage, paginate}}/>
          </div>
          <div className="flex flex-row w-full h-full absolute top-0 left-0">
            <div className="w-1/2 cursor-pointer" onClick={() => paginate(-1)}/>
            <div className="w-1/2 cursor-pointer" onClick={() => paginate(1)}/>
          </div>
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
