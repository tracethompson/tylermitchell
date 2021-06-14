import "../styles/index.css";

export default function MyApp(props) {
  const { Component, pageProps } = props
  return (
    <div className='h-full w-full'>
      <Component {...pageProps} />
    </div>
  );
}
