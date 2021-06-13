import React from 'react';
import ReactPlayer from 'react-player';

const Preview = ({ value }) => {
  const { url } = value;
  return <ReactPlayer url={url} controls />;
};

export default {
  name: 'embed',
  title: 'oEmbed',
  type: 'object',
  fields: [
    {
      name: 'url',
      type: 'url',
      title: 'URL',
    },
  ],
  preview: {
    select: {
      url: 'url',
    },
    component: Preview,
  },
};
