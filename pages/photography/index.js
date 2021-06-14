import { getClient } from "../../utils/sanity";
import Grid from "../../components/Grid";
import Layout from "../../components/Layout";

const query = `//groq
  *[_type == "photo"] | order(date desc)
`;

function PhotographyPageContainer({ data, siteSettings }) {
  return  (
    <Layout siteSettings={siteSettings} latest={data[0]} title="Photography">
      <div className="py-8 px-8 xl:px-20">
        <Grid items={data} type="photo" />
      </div>
    </Layout>
  )
}

export async function getStaticProps({ params = {} }) {
  const settingsQuery = `//groq
    *[_type == "siteConfig"]
  `
  const siteSettings = await getClient(true).fetch(settingsQuery);

  const data = await getClient(true).fetch(query);

  return {
    props: { data, siteSettings },
  };
}

export default PhotographyPageContainer;
