import Plugin from "@ckeditor/ckeditor5-core/src/plugin";

export default class RemoveFormatLinks extends Plugin {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  init(): void {
    console.log("RemoveFormatLinks#init() got called");
    this.editor.model.schema.setAttributeProperties("linkHref", {
      isFormatting: true,
    });
  }
}
