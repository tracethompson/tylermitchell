import { getClient, urlFor } from "../utils/sanity";
import Layout from "../components/Layout";
import RichText from "../components/RichText"

function AboutPage({ data, siteSettings }) {
  return (
    <Layout siteSettings={siteSettings} title="About">
      <div className="h-full w-full lg:p-8 pt-0 pb-2 px-4 flex flex-col about">
        {siteSettings && siteSettings[0].about.map((block, i) => <RichText key={i} content={block} />)}
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

export default AboutPage;
