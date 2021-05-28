import Command from "@ckeditor/ckeditor5-core/src/command";

export default class InsertSimpleBoxCommand extends Command {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(editor: any) {
    super(editor);
  }

  execute(): void {
    this.editor.model.change((writer: any) => {
      // Insert <simpleBox>*</simpleBox> at the current selection position
      // in a way that will result in creating a valid model structure.
      this.editor.model.insertContent(createSimpleBox(writer));
    });
  }

  refresh(): void {
    const model = this.editor.model;
    const selection = model.document.selection;
    const allowedIn = model.schema.findAllowedParent(
      selection.getFirstPosition(),
      "simpleBox"
    );

    this.isEnabled = allowedIn !== null;
  }
}

function createSimpleBox(writer: any) {
  const simpleBox = writer.createElement("simpleBox");
  const simpleBoxTitle = writer.createElement("simpleBoxTitle");
  const simpleBoxDescription = writer.createElement("simpleBoxDescription");

  writer.append(simpleBoxTitle, simpleBox);
  writer.append(simpleBoxDescription, simpleBox);

  // There must be at least one paragraph for the description to be editable.
  // See https://github.com/ckeditor/ckeditor5/issues/1464.
  writer.appendElement("paragraph", simpleBoxDescription);

  return simpleBox;
}
