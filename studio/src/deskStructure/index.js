import S from "@sanity/desk-tool/structure-builder";
import { MdWeb, MdSettings, MdWhatshot, MdLooks } from "react-icons/md";
// Hide document types that we already have a structure definition for
const hiddenDocTypes = (listItem) =>
  ![
    "siteSettings"
  ].includes(listItem.getId());

export default () =>
  S.list()
    .title("Documents")
    .items([
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ]);

export const getDefaultDocumentNode = (props) => {
  /**
   * Here you can define fallback views for document types without
   * a structure definition for the document node. If you want different
   * fallbacks for different types, or document values (e.g. if there is a slug present)
   * you can set up that logic in here too.
   * https://www.sanity.io/docs/structure-builder-reference#getdefaultdocumentnode-97e44ce262c9
   */
  return S.document().views([S.view.form()]);
};
