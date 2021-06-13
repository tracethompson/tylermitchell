import Error from "next/error"
import { groq } from "next-sanity"
import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import RichText from "../../components/RichText"
import ImageGallery from "../../components/ImageGallery"
import { urlFor, chunkImages } from "../../utils/sanity"
import { getClient, usePreviewSubscription } from "../../utils/sanity"
import ReactPlayer from 'react-player'
import { useState, useEffect } from "react"
import { getImageDimensions } from '@sanity/asset-utils'

const query = groq`*[_type == "film" && slug.current == $slug][0]`;

const InstallationFilmBody = ({handleImageClick, coverImage, title, details, description, showImageGallery, medium, images, setPage, page, direction, paginate}) => {
  if (showImageGallery) {
    return (
      <div className="h-full md:pt-8 pb-16 px-8 mx-auto flex content-center items-center relative">
        <ImageGallery images={images} {...{page, direction, setPage, paginate}}/>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full lg:w-10/12 mx-auto px-4 lg:px-0 lg:pt-8 h-full">
      <div
        className="w-full relative mb-4 h-3/4 lg:h-1/2 hidden lg:block"
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
      <div className="flex flex-col md:flex-row">
          <div className="flex flex-col md:w-1/4">
            <h1 className="font-bold md:text-2xl lg:text-3xl xl:text-4xl">{title}</h1>
            <p className="mb-2">{medium}</p>
            <div className="flex flex-col md:w-3/4">
              {details?.map((block, i) => <RichText key={i} content={block} />)}
            </div>
          </div>
          <div className="flex flex-col lg:w-3/4 mt-2 lg:pl-4 pb-8">
            {description?.map((block, i) => <RichText key={i} content={block} />)}
            <p className="mt-2">Click the image for installation views</p>
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

function FilmContainer({ filmData }) {
  const router = useRouter();
  if (!router.isFallback && !filmData?.slug) {
    return <Error statusCode={404} />;
  }

  const { data: film = {} } = usePreviewSubscription(query, {
    params: { slug: filmData?.slug?.current },
    initialData: filmData,
  });

  const {
    title,
    embed,
    coverImage,
    subtitle: medium,
    description,
    details,
    images
  } = film

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

  const [currentTitle, setCurrentTitle] = useState(embed ? title : null)

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
    <Layout currentTitle={currentTitle} onBackPress={onBackPress} showBack={showImageGallery}>
      <div className="w-full h-full">
        {embed ?
          (
            <div className="md:pt-8 w-10/12 mx-auto">
              <div className="player-wrapper">
                {embed && embed.url && (
                  <ReactPlayer
                    controls
                    width="100%"
                    height="100%"
                    className="player"
                    url={`${embed.url}&mini=1`}
                  />
                )}
              </div>
            </div> 
          ) :
          (
            <div className="relative w-full h-full">
              <InstallationFilmBody {...{handleImageClick, coverImage, title, details, description, medium, showImageGallery, images: chunkedImages, setPage, page, direction, paginate}} />
              {showImageGallery ?
                <div className="flex flex-row w-full h-full absolute top-0 left-0">
                  <div className="w-1/2 cursor-pointer" onClick={() => paginate(-1)}/>
                  <div className="w-1/2 cursor-pointer" onClick={() => paginate(1)}/>
                </div> : null
              }
            </div>
          )
        }
      </div>
    </Layout>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const filmData = await getClient(preview).fetch(query, {
    slug: params.slug,
  });

  return {
    props: { preview, filmData, params },
  };
}

export async function getStaticPaths() {
  const paths = await getClient().fetch(
    `*[_type == "film" && defined(slug.current)][].slug.current`
  );
  
  return {
    paths: paths?.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}

export default FilmContainer;
