import Command from "@ckeditor/ckeditor5-core/src/command";

export default class CommentCommand extends Command {
  attributeKey = "";

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(editor: any, attributeKey: string) {
    super(editor);
    this.attributeKey = attributeKey;
  }

  refresh(): void {
    const model = this.editor.model;
    const doc = model.document;

    this.value = this.getValueFromFirstAllowedNode();
    this.isEnabled = model.schema.checkAttributeInSelection(
      doc.selection,
      this.attributeKey
    );
  }

  execute(options: { forceValue?: any } = {}): void {
    const model = this.editor.model;
    const doc = model.document;
    const selection = doc.selection;
    const value =
      options.forceValue === undefined ? !this.value : options.forceValue;

    model.change((writer: any) => {
      const range = selection.getFirstRange();
      console.log(range.getItems().next().value.data);
      for (const item of range.getItems()) {
        console.log(item.data);
      }
      if (selection.isCollapsed) {
        if (value) {
          writer.setSelectionAttribute(this.attributeKey, true);
        } else {
          writer.removeSelectionAttribute(this.attributeKey);
        }
      } else {
        const ranges = model.schema.getValidRanges(
          selection.getRanges(),
          this.attributeKey
        );

        for (const range of ranges) {
          if (value) {
            writer.setAttribute(this.attributeKey, value, range);
          } else {
            writer.removeAttribute(this.attributeKey, range);
          }
        }
      }
    });
  }

  private getValueFromFirstAllowedNode(): boolean {
    const model = this.editor.model;
    const schema = model.schema;
    const selection = model.document.selection;

    if (selection.isCollapsed) {
      return selection.hasAttribute(this.attributeKey);
    }

    for (const range of selection.getRanges()) {
      for (const item of range.getItems()) {
        if (schema.checkAttribute(item, this.attributeKey)) {
          return item.hasAttribute(this.attributeKey);
        }
      }
    }

    return false;
  }
}
