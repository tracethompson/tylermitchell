// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";
// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";

// We import object and document schemas
import film from "./documents/film";
import photo from "./documents/photo";
import embed from "./documents/embed";
import book from "./documents/book";
import exhibition from "./documents/exhibition";
import siteConfig from './documents/siteConfig'

// Object types
import blockContent from "./objects/blockContent";
import contactInfo from "./objects/contactInfo";

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: "default",
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    // The following are document types which will appear
    // in the studio.
    siteConfig,
    embed,
    photo,
    film,
    book,
    exhibition,
    // When added to this list, object types can be used as
    contactInfo,
    blockContent,
  ]),
});
