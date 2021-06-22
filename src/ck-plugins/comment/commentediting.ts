import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import CommentCommand from "./commentcommand";
import "./theme/comment.scss";

const COMMENT = "comment";

export default class CommentEditing extends Plugin {
  init(): void {
    const editor = this.editor;

    editor.model.schema.extend("$text", { allowAttributes: COMMENT });
    editor.model.schema.setAttributeProperties(COMMENT, {
      isFormatting: true,
      copyOnEnter: true,
    });

    editor.conversion.attributeToElement({
      model: COMMENT,
      view: {
        name: "mark",
        classes: "comment",
      },
    });

    editor.commands.add(COMMENT, new CommentCommand(editor, COMMENT));
  }
}
