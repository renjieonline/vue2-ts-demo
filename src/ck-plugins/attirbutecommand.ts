import Command from "@ckeditor/ckeditor5-core/src/command";

export default class AttributeCommand extends Command {
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

  /**
   * Executes the command &mdash; applies the attribute to the selection or removes it from the selection.
   *
   * If the command is active (`value == true`), it will remove attributes. Otherwise, it will set attributes.
   *
   * The execution result differs, depending on the {@link module:engine/model/document~Document#selection}:
   *
   * * If the selection is on a range, the command applies the attribute to all nodes in that range
   * (if they are allowed to have this attribute by the {@link module:engine/model/schema~Schema schema}).
   * * If the selection is collapsed in a non-empty node, the command applies the attribute to the
   * {@link module:engine/model/document~Document#selection} itself (note that typed characters copy attributes from the selection).
   * * If the selection is collapsed in an empty node, the command applies the attribute to the parent node of the selection (note
   * that the selection inherits all attributes from a node if it is in an empty node).
   *
   * @fires execute
   * @param {Object} [options] Command options.
   * @param {Boolean} [options.forceValue] If set, it will force the command behavior. If `true`, the command will apply the attribute,
   * otherwise the command will remove the attribute.
   * If not set, the command will look for its current value to decide what it should do.
   */
  execute(options: { forceValue?: any } = {}): void {
    const model = this.editor.model;
    const doc = model.document;
    const selection = doc.selection;
    const value =
      options.forceValue === undefined ? !this.value : options.forceValue;

    model.change((writer: any) => {
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
