import { getClient } from "../../utils/sanity";
import Grid from "../../components/Grid";
import Layout from "../../components/Layout";

const query = `//groq
  *[_type == "photo"]
`;

function PhotographyPageContainer({ data }) {
  return  (
    <Layout>
      <div className="py-8 px-8 xl:px-20">
        <Grid items={data} type="photo" />
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

export default PhotographyPageContainer;
