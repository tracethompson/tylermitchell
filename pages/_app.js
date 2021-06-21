import "../styles/index.css";
import useGrid from "../utils/useGrid";

export default function MyApp(props) {
  const { Component, pageProps } = props
  const [imageGrid, setGrid] = useGrid()
  return (
    <div className='h-full w-full'>
      <Component {...pageProps} imageGrid={imageGrid} setGrid={setGrid} />
    </div>
  );
}
