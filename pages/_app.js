import "../styles/index.css";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <div className='h-full w-full'>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
