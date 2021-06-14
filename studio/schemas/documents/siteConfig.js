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
      title: 'Hero title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Hero description',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Hero image',
      type: 'image',
    },
  ],
};
