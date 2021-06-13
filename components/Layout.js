import { useState } from "react";
import { useRouter } from 'next/router'
import Link from "next/link";

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
          <a href="mailto:studio@tylermitchell.co" className={linkClass}>
            Contact
          </a>
        </>
      )
  }
}

const Header = ({route}) => {
  return (
    <header className="pt-4 pl-4 lg:pt-8 lg:pl-8 lg:absolute left-0 top-0 lg:h-full lg:text-right">
      <nav>
        <div className="flex flex-col">
          <Link href="/">
            <a className="text-black font-bold text-xl">
              Tyler Mitchell
            </a>
          </Link>
          <MakeHeaderItems route={route} />
        </div>
      </nav>
    </header>
  )
}


function Layout({ children, currentTitle, onBackPress, showBack}) {
  const { route } = useRouter()
  const isHome = route === '/'
  return (
    <div className="bg-white flex flex-col h-full max-h-full w-full overflow-scroll">
      <Header {...{route}}/>
      <main className="content__width max-h-full h-full overflow-scroll">{children}</main>
      <footer className="absolute w-full left-0 bottom-0 pb-4 px-4 lg:pb-8 lg:px-8 flex text-right">  
        {isHome ? 
        (
          <div className="flex flex-col mt-auto">
            <a href="https://icmyfg.com" className="text-accent mb">
              ICMYFG
            </a>
            <a href="https://www.instagram.com/tylersphotos/?hl=en" className="text-accent mb">
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
      </footer>
    </div>
  );
}

export default Layout;
