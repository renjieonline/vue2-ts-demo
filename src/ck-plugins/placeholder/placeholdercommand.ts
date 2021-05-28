import Command from "@ckeditor/ckeditor5-core/src/command";

export default class PlaceholderCommand extends Command {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(editor: any) {
    super(editor);
  }
  execute({ value }: { value: string }): void {
    const editor = this.editor;
    const selection = editor.model.document.selection;

    editor.model.change((writer: any) => {
      const placeholder = writer.createElement("placeholder", {
        ...Object.fromEntries(selection.getAttributes()),
        name: value,
      });

      editor.model.insertContent(placeholder);

      writer.setSelection(placeholder, "on");
    });
  }

  refresh(): void {
    const model = this.editor.model;
    const selection = model.document.selection;
    const isAllowed = model.schema.checkChild(
      selection.focus.parent,
      "placeholder"
    );

    this.isEnabled = isAllowed;
  }
}
