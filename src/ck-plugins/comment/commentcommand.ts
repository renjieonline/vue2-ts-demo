import Command from "@ckeditor/ckeditor5-core/src/command";

export default class CommentCommand extends Command {
  attributeKey = "";
  selectedText = "";
  value = false;
  selectedMarker = null;
  selections: any[] = [];

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(editor: any, attributeKey: string) {
    super(editor);
    this.attributeKey = attributeKey;
    (window as any).commentCommand = this;
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
    this.selections.push({});
    console.log(this.selections);
    const value =
      options.forceValue === undefined ? !this.value : options.forceValue;

    model.change((writer: any) => {
      console.log(
        selection.getFirstPosition(),
        selection.getFirstRange(),
        selection.getLastPosition(),
        selection.getLastRange()
      );
      let selectedText = "";
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
            writer.addMarker("" + Math.random(), {
              range,
              usingOperation: true,
            });
          } else {
            writer.removeAttribute(this.attributeKey, range);
          }
          for (const item of range.getItems()) {
            selectedText += item.data;
          }
        }
      }

      this.selectedText = selectedText;
      console.log(writer.model.markers);
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

  private isSelection;
}
