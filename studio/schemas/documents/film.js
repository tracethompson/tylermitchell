import { format } from 'date-fns';
import { FaFilm } from 'react-icons/fa';

export default {
  name: 'film',
  title: 'Film',
  icon: FaFilm,
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title (Required)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'Slug (Required)',
      name: 'slug',
      type: 'slug',
      description: 'Used for creating unique page URLs',
      validation: (Rule) => [
        Rule.required().error('Slug field must be filled out'),
      ],
      options: {
        source: 'title',
        maxLength: 100,
        isUnique: () => true,
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      options: {
        dateFormat: 'yyyy',
      }
    },
    {
      name: 'subtitle',
      title: 'Medium',
      type: 'string',
      description: 'E.g. - "Single channel ceiling mounted video, sound, turf grass, white picket fence"',
    },
    {
      name: 'details',
      title: 'Film details',
      type: 'array',
      description: 'E.g. - RT: 12 min 45 sec, Dimensions Variable, Edition of 20',
      of: [
        {
          type: 'block',
        },
      ],
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      description: 'Description for film',
      of: [
        {
          type: 'block',
        },
      ],
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'Default images for products',
      of: [{ type: 'image',   options: {metadata: ['image']} }],
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
    },
    {
      name: 'embed',
      title: 'Embed',
      description: 'URL of embed from YouTube, Vimeo, etc.',
      type: 'embed',
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
    },
    prepare(selection) {
      return {
        title: selection.title,
        date: selection.date,
        subtitle: format(new Date(selection.date), 'yyyy'),
      };
    },
  },
};
