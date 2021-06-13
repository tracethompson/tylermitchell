import { getClient, urlFor } from "../../utils/sanity";
import Layout from "../../components/Layout";
import RichText from "../../components/RichText";
import Link from 'next/link'

const query = `//groq
  *[_type == "exhibition"]
`;

function ExhibitionsPageContainer({ data }) {
  return  (
    <Layout>
      <div className="py-8 px-8 xl:px-20">
        {data.map(exhibition => {
          const { coverImage, title, description, slug } = exhibition
          return (
            <Link href={`/exhibitions/${slug.current}`}>
              <div className="flex w-full mb-8 h-full relative">
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
                    {description.map((block, i) => <RichText key={i} content={block} />)}
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

export default ExhibitionsPageContainer;
