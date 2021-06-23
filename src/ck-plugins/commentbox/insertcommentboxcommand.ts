import Command from "@ckeditor/ckeditor5-core/src/command";

export default class InsertCommentBoxCommand extends Command {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(editor: any) {
    super(editor);
  }

  execute(title: string, content: string): void {
    this.editor.model.change((writer: any) => {
      writer.append(
        createCommentBox(writer, title, content),
        writer.model.document.getRoot()
      );
    });
  }

  refresh(): void {
    const model = this.editor.model;
    const selection = model.document.selection;
    const allowedIn = model.schema.findAllowedParent(
      selection.getFirstPosition(),
      "commentBox"
    );

    this.isEnabled = allowedIn !== null;
  }
}

function createCommentBox(writer: any, title: string, content: string) {
  const commentBox = writer.createElement("commentBox");
  const commentBoxTitle = writer.createElement("commentBoxTitle");
  const commentBoxContent = writer.createElement("commentBoxContent");

  writer.append(commentBoxTitle, commentBox);
  writer.append(commentBoxContent, commentBox);
  writer.insertText(title, commentBoxTitle);
  writer.insertText(content, commentBoxContent);

  // There must be at least one paragraph for the description to be editable.
  // See https://github.com/ckeditor/ckeditor5/issues/1464.
  writer.appendElement("paragraph", commentBoxContent);

  return commentBox;
}
