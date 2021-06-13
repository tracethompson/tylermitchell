import { getClient, urlFor } from "../../utils/sanity";
import Layout from "../../components/Layout";
import Link from 'next/link'

const query = `//groq
  *[_type == "book"]
`;

function BooksPageContainer({ data }) {
  return  (
    <Layout>
      <div className="py-8 px-8 xl:px-20">
        {data.map(book => {
          const { coverImage, title, subtitle, date, slug, _id } = book
          const year = date?.slice(0, 4)
          return (
            <Link href={`/books/${slug.current}`} key={_id}>
              <div className="flex w-full mb-8 h-full relative cursor-pointer">
                <img
                  className="shop__image w-1/3"
                  src={
                    urlFor(coverImage?.asset)
                      .auto("format")
                      .fit("max")
                      .quality(100)
                  }
                  loading="lazy"
                />
                <div className="w-2/3 pl-4 h-auto flex flex-col flex-grow">
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

  return {
    props: { data },
  };
}

export default BooksPageContainer;
