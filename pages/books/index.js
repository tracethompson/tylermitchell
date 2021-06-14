import { getClient, urlFor } from "../../utils/sanity";
import Layout from "../../components/Layout";
import Link from 'next/link'

const query = `//groq
  *[_type == "book"] | order(date desc)
`;

function BooksPageContainer({ data, siteSettings }) {
  return  (
    <Layout siteSettings={siteSettings} latest={data[0]} title="Books">
      <div className="py-8 px-4 md:px-8 xl:px-20">
        {data.map(book => {
          const { coverImage, title, subtitle, date, slug, _id } = book
          const year = date?.slice(0, 4)
          return (
            <Link href={`/books/${slug.current}`} key={_id}>
              <div className="flex flex-col md:flex-row w-full mb-8 h-full relative cursor-pointer">
                <img
                  className="shop__image w-full md:w-1/3"
                  src={
                    urlFor(coverImage?.asset)
                      .auto("format")
                      .fit("max")
                      .width(400)
                      .quality(100)
                  }
                  loading="lazy"
                />
                <div className="w-full md:w-2/3 md:pl-4 h-auto flex flex-col flex-grow">
                    <h1 className="font-bold italic text-xl mt-auto">{title}</h1>
                    <h2>{subtitle}</h2>
                    <h2>{year}</h2>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </Layout>
  )
}

export async function getStaticProps({ params = {} }) {
  const data = await getClient(true).fetch(query);

  const settingsQuery = `//groq
    *[_type == "siteConfig"]
  `
  const siteSettings = await getClient(true).fetch(settingsQuery);

  return {
    props: { data, siteSettings },
  };
}

export default BooksPageContainer;
