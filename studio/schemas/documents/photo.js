import { format } from 'date-fns';
import { FaImage } from 'react-icons/fa';

export default {
  name: 'photo',
  title: 'Photo',
  icon: FaImage,
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
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image',   options: {metadata: ['image']} }],
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [],
          lists: [],
          marks: {
            decorators: [{ title: 'Emphasis', value: 'em' }],
          },
        },
      ],
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
