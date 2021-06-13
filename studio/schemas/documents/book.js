import { format } from 'date-fns';
import { FaBook } from 'react-icons/fa';

export default {
  name: 'book',
  title: 'Book',
  icon: FaBook,
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
      title: 'Subtitle',
      type: 'string',
      description: 'E.g. - Published by Prestel',
    },
    {
      name: 'details',
      title: 'Book details',
      type: 'array',
      description: 'E.g. - Hardcover, 206 pages, 12.5 x 9.5 inches Text contributions by Deborah Willis',
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
    {
      name: 'pressRelease',
      title: 'Press release (url)',
      type: 'file',
    },
    {
      name: 'buy',
      title: 'Buy link (url)',
      type: 'url',
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
