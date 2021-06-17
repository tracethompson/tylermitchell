import Error from "next/error"
import { groq } from "next-sanity"
import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import RichText from "../../components/RichText"
import ImageGallery from "../../components/ImageGallery"
import { urlFor, chunkImages, getTheFile } from "../../utils/sanity"
import { getClient, usePreviewSubscription } from "../../utils/sanity"
import { useState, useEffect } from "react"
import { getImageDimensions } from '@sanity/asset-utils'


const query = groq`*[_type == "exhibition" && slug.current == $slug][0]`;

const MainBody = ({handleImageClick, coverImage, title, description, showImageGallery, images, setPage, page, direction, paginate, pressRelease}) => {
  const file = pressRelease && getTheFile(pressRelease)
  const url = file?.url

  if (showImageGallery) {
    return (
      <div className="h-full md:pt-8 pb-16 px-4 lg:px-8 mx-auto flex content-center items-center relative">
        <ImageGallery images={images} {...{page, direction, setPage, paginate}}/>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full lg:w-10/12 mx-auto px-4 lg:px-0 pb-8 lg:pt-8 h-full">
      <div
        className="w-full relative mb-4 md:px-8 lg:px-0 h-3/4 lg:h-1/2 hidden lg:block"
        style={{ height: '60%' }}
        onClick={handleImageClick}
      >
        <img
          className="cover__image cursor-pointer"
          src={
            urlFor(coverImage?.asset)
              .auto("format")
              .fit("max")
              .quality(100)
          }
          loading="lazy"
        />
      </div>
      <img
        className="block lg:hidden cursor-pointer w-full"
        src={
          urlFor(coverImage?.asset)
            .auto("format")
            .fit("max")
            .quality(100)
        }
        loading="lazy"
        onClick={handleImageClick}
      />
      <div className="flex flex-col lg:flex-row mt-1">
          <div className="flex flex-col w-full">
            <h1 className="font-bold md:text-2xl lg:text-3xl xl:text-4xl">{title}</h1>
            {description && description.map((block, i) => <RichText key={i} content={block} />)}
            <div className="flex flex-row mt-2 xl:mt-auto">
              <a href={url} target="_blank">
                <p className="cursor-pointer font-bold text-sm text-accent">
                  Press Release
                </p>
              </a>
            </div>
          </div>
      </div>
      <style jsx>{`
        .cover__image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
        }
      `}</style>
    </div>
  )
} 

function ExhibitionsContainer({ exhibitionData, siteSettings }) {
  const router = useRouter();
  if (!router.isFallback && !exhibitionData?.slug) {
    return <Error statusCode={404} />;
  }

  const { data: exhibition = {} } = usePreviewSubscription(query, {
    params: { slug: exhibitionData?.slug?.current },
    initialData: exhibitionData,
  });

  const {
    title,
    coverImage,
    description,
    images,
    pressRelease,
    slug,
    buy
  } = exhibition

  const [chunkedImages, setChunkedImages] = useState([])

  const formattedImages = images && images.map(img => {
    const {aspectRatio} = getImageDimensions(img.asset)
    return {
      src: urlFor(img.asset).auto("format").fit("max").height(800).quality(100),
      aspectRatio,
    }
  })

  useEffect(() => {
    if (images && images.length) {
      formattedImages.forEach(img => new Image().src = img.src)
      const chunks = chunkImages(formattedImages)
      setChunkedImages(chunks)
    }
  }, [])

  const [showImageGallery, setShowImageGallery] = useState(false)

  const [currentTitle, setCurrentTitle] = useState(null)

  const [[page, direction], setPage] = useState([0, 0])

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleImageClick = () => {
    setShowImageGallery(true)
    setCurrentTitle(title)
  }

  const onBackPress = () => {
    setCurrentTitle('')
    setShowImageGallery(false)
  }

  return (
    <Layout coverImage={coverImage} currentTitle={currentTitle} onBackPress={onBackPress} showBack={showImageGallery} siteSettings={siteSettings} title={title}>
      <div className="w-full h-full">
        <div className="relative w-full h-full">
          <MainBody {...{handleImageClick, coverImage, title, description, showImageGallery, images: chunkedImages, setPage, page, direction, paginate, pressRelease, slug, buy}} />
          {showImageGallery ?
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
  const exhibitionData = await getClient(preview).fetch(query, {
    slug: params.slug,
  });

  const settingsQuery = `//groq
    *[_type == "siteConfig"]
  `
  const siteSettings = await getClient(true).fetch(settingsQuery);

  return {
    props: { preview, exhibitionData, params, siteSettings },
  };
}

export async function getStaticPaths() {
  const paths = await getClient().fetch(
    `*[_type == "exhibition" && defined(slug.current)][].slug.current`
  );
  
  return {
    paths: paths && paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}

export default ExhibitionsContainer;
