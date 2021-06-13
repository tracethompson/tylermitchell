import { useRouter } from "next/router";
import { getClient, urlFor } from "../utils/sanity";
import Layout from "../components/Layout";

const query = `//groq
  *[] | order(date desc) [0]
`;

function IndexPage(props) {
  const { data, preview } = props;
  const router = useRouter();

  return (
    <Layout>
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
  const data = await getClient(preview).fetch(query);
  return {
    props: {
      preview,
      data,
    },
  };
}

export default IndexPage;
