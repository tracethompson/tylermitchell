import { FaCog } from 'react-icons/fa';

export default {
  name: 'siteConfig',
  title: 'Site settings',
  __experimental_actions: ["update", /* 'create', 'delete', */ "publish"],
  icon: FaCog,
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Metadata title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Matadata description',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Metadata image',
      type: 'image',
    },
    {
      name: 'homeImage',
      title: 'Homepage image',
      type: 'image',
    },
    {
      name: 'about',
      title: 'About',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    },
  ],
};
