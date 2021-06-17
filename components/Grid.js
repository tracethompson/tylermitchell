import { urlFor } from "../utils/sanity"
import Link from 'next/link'

const GridItemFilm = ({ item: { title,  coverImage, slug } }) => {
  return (
    <div className="w-full md:w-1/2 md:px-4 mb-4 lg:mb-16" onClick={() => null}>
      <Link href={`/films/${slug.current}`}>
        <div
          className="w-full relative cursor-pointer group"
          style={{ height: '260px' }}
        >
          <div className="absolute bg-dark-filter h-full p-2 w-full relative top-0 left-0 flex lg:hidden lg:group-hover:flex flex-col content-center items-center justify-center text-center z-10">
            <h1 className="text-sm text-white mb-4">{title}</h1>
          </div>
          <img
            className="shop__image"
            src={
              urlFor(coverImage?.asset)
                .auto("format")
                .width(1000) 
                .fit("max")
                .quality(100)
            }
            loading="lazy"
          />
        </div>
      </Link>

      <style jsx>{`
        .shop__image {
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

const GridItemPhoto = ({
  item: { title, coverImage, slug},
}) => {
  const bgImg = urlFor(coverImage?.asset)
    .auto("format")
    .width(1000)
    .fit("max")
    .quality(100)
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/4 mx-auto sm:mx-0 sm:px-4 mb-4">
      <Link href={`/photography/${slug.current}`}>
        <div className="w-full relative cursor-pointer group photo__card">
          <div className="absolute bg-dark-filter h-full p-2 w-full relative top-0 left-0 flex lg:hidden lg:group-hover:flex flex-col content-center items-center justify-center text-center z-10">
            <h1 className="text-sm text-white mb-4">{title}</h1>
          </div>
          <div className="video__image" style={{backgroundImage: `url(${bgImg})`}}/>
        </div>
      </Link>
      <style jsx>{`
        .video__image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
          background-size: cover;
          background-position-x: center;
          background-position-y: center;
        }
      `}</style>
    </div>
  )
}

export default function Grid({ items, type }) {
  return (
    <div className="relative w-full">
      <div className="flex md:-mx-4 flex-wrap max-w-full">
        {items.map((item) => {
          let ItemEl
          if (type === 'film')
            ItemEl = <GridItemFilm {...{ item }} key={item._id} />
          else if (type === 'photo')
            ItemEl = <GridItemPhoto {...{ item }} key={item._id} />
          return ItemEl
        })}
      </div>
    </div>
  )
}
