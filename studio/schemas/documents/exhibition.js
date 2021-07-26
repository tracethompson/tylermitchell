import { format } from 'date-fns';
import { FaBuilding } from 'react-icons/fa';

export default {
  name: 'exhibition',
  title: 'Exhibition',
  icon: FaBuilding,
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
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
    },
    {
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'Default images for products',
      of: [{ 
        type: 'image',   
        options: {metadata: ['image']},
        fields: [
          {
            title: 'Show as singular image (disable diptych view)?',
            name: 'singular',
            type: 'boolean',
            description: 'All portrait photos default to show as diptych on desktop view unless this button is clicked. All landscape photos will show as singular images always.',
          }
        ],
      }],
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
  ],
  preview: {
    select: {
      title: 'title',
      startDate: 'startDate',
      endDate: 'endDate',
    },
    prepare(selection) {
      return {
        title: selection.title,
        date: selection.startDate,
        // subtitle: format(/new Date(selection.startDate), 'yyyy'),
        subtitle: `${format(new Date(selection.startDate), 'LLLL do')} - ${format(new Date(selection.endDate), 'PPP')}`,
      };
    },
   },
};
