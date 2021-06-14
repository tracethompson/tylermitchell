import { useRouter } from "next/router";
import { getClient, urlFor } from "../utils/sanity";
import Layout from "../components/Layout";

const query = `//groq
  *[] | order(date desc) [0]
`;

function IndexPage({ data, preview, siteSettings }) {
  return (
    <Layout siteSettings={siteSettings} title="Books">
      <div className="h-full max-h-full mx-auto py-8">
          <img
            className="max-h-full max-w-full obect-cover mx-auto"
            src={urlFor(data?.coverImage)
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

  const data = await getClient(preview).fetch(query);
  return {
    props: {
      preview,
      data,
      siteSettings
    },
  };
}

export default IndexPage;
