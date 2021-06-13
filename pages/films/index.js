import { getClient } from "../../utils/sanity";
import Grid from "../../components/Grid";
import Layout from "../../components/Layout";

const query = `//groq
  *[_type == "film"]
`;

function ProductsPageContainer({ data }) {
  return  (
    <Layout>
      <div className="p-4 lg:p-8 xl:px-20">
        <Grid items={data} type="film" />
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

export default ProductsPageContainer;
