import "../styles/index.css";
import {useState} from "react";

export default function MyApp(props) {
  const { Component, pageProps } = props
  const [imageGrid, setGrid] = useState(false)
  return (
    <div className='h-full w-full'>
      <Component {...pageProps} imageGrid={imageGrid} setGrid={setGrid} />
    </div>
  );
}
