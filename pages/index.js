import { useRouter } from "next/router";
import { getClient, urlFor } from "../utils/sanity";
import Layout from "../components/Layout";


function IndexPage({ data, siteSettings }) {
  console.log('site settings: ', siteSettings)
  const image = siteSettings && siteSettings[0]?.homeImage
  return (
    <Layout siteSettings={siteSettings}>
      <div className="h-full max-h-full mx-auto lg:py-8 pb-2 flex">
          <img
            className="max-h-full max-w-full obect-cover mx-auto my-auto px-4 lg:px-0"
            src={urlFor(image)
              .auto("format")
              .width(1051)
              .fit("crop")
              .quality(100)
            }
          />
      </div>
    </Layout>
  );
}

export async function getStaticProps({ params = {}, preview = false }) {
  const settingsQuery = `//groq
    *[_type == "siteConfig"]
  `
  const siteSettings = await getClient(true).fetch(settingsQuery);

  return {
    props: {
      preview,
      siteSettings
    },
  };
}

export default IndexPage;
