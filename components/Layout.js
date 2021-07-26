import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from "next/link";
import { urlFor } from "../utils/sanity";
import GridIcon from '../components/GridIcon'
import DiptycheIcon from '../components/DipytycheIcon'
const BASE_URL = 'https://tylermitchell.co'


const MakeHeaderItems = ({route}) => {
  const linkClass = `text-black lg:text-right text-lg mt`
  switch(route) {
    case '/films':
    case '/films/[slug]':
      return (
        <Link href="/films">
          <a className={linkClass}>
            Films
          </a>
        </Link>
      )
    case '/photography':
    case '/photography/[slug]':
        return (
          <Link href="/photography">
            <a className={linkClass}>
              Photography
            </a>
          </Link>
        )
    case '/books':
    case '/books/[slug]':
      return (
        <Link href="/books">
          <a className={linkClass}>
            Books
          </a>
        </Link>
      )
    case '/exhibitions':
    case '/exhibitions/[slug]':
        return (
          <Link href="/exhibitions">
            <a className={linkClass}>
              Exhibitions
            </a>
          </Link>
        )
    case '/about':
      return (
        <Link href="/about">
          <a className={linkClass}>
            About
          </a>
        </Link>
      )
    default:
      return (
        <>
          <Link href="/films">
            <a className={linkClass}>
              Films
            </a>
          </Link>
          <Link href="/photography">
            <a className={linkClass}>
              Photography
            </a>
          </Link>
          <Link href="/books">
            <a className={linkClass}>
              Books
            </a>
          </Link>
          <Link href="/exhibitions">
            <a className={linkClass}>
              Exhibitions
            </a>
          </Link>
          <Link href="/about">
            <a className={linkClass}>
              About
            </a>
          </Link>
          <a href="mailto:studio@tylermitchell.co" className={linkClass}>
            Contact
          </a>
        </>
      )
  }
}

const Header = ({route}) => {
  return (
    <header className="pt-4 pl-4 mb-2 lg:pt-8 lg:pl-8 lg:absolute left-0 top-0 lg:h-full lg:text-right">
      <nav>
        <div className="flex flex-row">
          <div className="flex flex-col">
            <Link href="/">
              <a className="text-black font-bold text-xl">
                Tyler Mitchell
              </a>
            </Link>
            <MakeHeaderItems route={route} />
          </div>
          <div className="block lg:hidden flex flex-col ml-auto pr-4 lg:pl-8 text-right">
            <a href="https://icmyfg.com" className="text-accent mb">
              ICMYFG
            </a>
            <a href="https://www.instagram.com/tylersphotos/?hl=en" className="text-accent mb">
              @tylersphotos
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}


function Layout({ setHighlight, highlightImage, setGrid, imageGrid, useGrid, children, currentTitle, onBackPress, showBack, siteSettings, title, description, latest, coverImage}) {
  const router = useRouter()
  const {asPath, route} = router
  const isHome = route === '/'
  const ogUrl = asPath ? `${BASE_URL}${asPath}` : BASE_URL


  const defaultTitle = siteSettings && siteSettings[0]?.title
  const defaultDescription = siteSettings && siteSettings[0]?.description
  const image = siteSettings && siteSettings[0]?.image
  
  let imgAsset = null
  if (coverImage) {
    imgAsset = coverImage.asset
  } else {
    imgAsset = latest ? latest?.coverImage?.asset : image?.asset
  }

  const ogImage = urlFor(imgAsset)
      .auto("format")
      .fit("max")
      .width(1200)
      .quality(100)
      ogImage

  
  const pageTitle = title ? `${title} | Tyler Mitchell` : defaultTitle
  const ogDescription = description || defaultDescription


  const handleGridClick = () => {
    if (imageGrid) {
      setGrid(false)
    } else {
      setGrid(true)
    }
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={ogDescription} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="og:type" content="website" />
        <meta name="og:title" content={pageTitle} />
        <meta name="og:url" content={ogUrl} />
        <meta name="og:description" content={ogDescription} />
        <meta name="og:image" content={ogImage} />
      </Head>
      <div className="bg-white flex flex-col h-full max-h-full w-full overflow-auto">
        <Header {...{route}}/>
        <main className="content__width max-h-full h-full overflow-auto">{children}</main>
        <footer className="relative w-full left-0 bottom-0 pb-4 px-4 lg:pb-8 lg:px-8 flex text-right">  
          {isHome ? 
          (
            <div className="flex-col mt-auto hidden lg:flex">
              <a href="https://icmyfg.com" className="text-accent mb" target="_blank">
                ICMYFG
              </a>
              <a href="https://www.instagram.com/tylersphotos/?hl=en" target="_blank" className="text-accent mb">
                @tylersphotos
              </a>
            </div>
            ) : null
          }
          { currentTitle ?
            <h2 className="mt-auto text-lg">
              {currentTitle}
            </h2> : null
          }
          { showBack ?
            <h1 className="cursor-pointer text-lg mt-auto ml-auto" onClick={onBackPress}>Back</h1> : null
          }
          {useGrid ?
            <div className="ml-auto mt-auto cursor-pointer" onClick={handleGridClick}>
              { imageGrid ? <DiptycheIcon /> : <GridIcon /> }
            </div> : null
          }
        </footer>
        {highlightImage ? 
          <div className="absolute w-full h-full top-0 left-0 bg-white z-index flex content-center items-center p-8 z-10">
            <div className="absolute right-0 text-xl top-0 pt-4 pr-4 cursor-pointer" onClick={() => setHighlight(null)}>
              X  
            </div>
            <img 
              className="max-h-full max-w-full mx-auto my-auto"
              src={
                urlFor(highlightImage?.asset)
                  .auto("format")
                  .width(1500) 
                  .fit("max")
                  .quality(100) 
              }
            />
          </div> : null
        }
      </div>
    </>
  );
}

export default Layout;
