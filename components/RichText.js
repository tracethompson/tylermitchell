import React from 'react'
import PortableText from '@sanity/block-content-to-react'

const serializers = {}

export default function RichText({ className = false, content }) {
  return (
    <div className={`markdown ${className && className}`}>
      <PortableText blocks={content} serializers={serializers} />
    </div>
  )
}
