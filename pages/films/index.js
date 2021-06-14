import { getClient } from "../../utils/sanity";
import Grid from "../../components/Grid";
import Layout from "../../components/Layout";

const query = `//groq
  *[_type == "film"] | order(date desc)
`;

function ProductsPageContainer({ data, siteSettings }) {
  return  (
    <Layout siteSettings={siteSettings} latest={data[0]} title="Films">
      <div className="p-4 lg:p-8 xl:px-20">
        <Grid items={data} type="film" />
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

export default ProductsPageContainer;
