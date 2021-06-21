import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import AttributeCommand from "../attirbutecommand";

const EMPHASIS = "emphasis";

export default class EmphasisEditing extends Plugin {
  init(): void {
    const editor = this.editor;

    // Allow italic attribute on text nodes.
    editor.model.schema.extend("$text", { allowAttributes: EMPHASIS });
    editor.model.schema.setAttributeProperties(EMPHASIS, {
      isFormatting: true,
      copyOnEnter: true,
    });

    editor.conversion.attributeToElement({
      model: EMPHASIS,
      view: "em",
      upcastAlso: [
        "i",
        {
          styles: {
            "font-style": "italic",
          },
        },
      ],
    });

    // Create italic command.
    editor.commands.add(EMPHASIS, new AttributeCommand(editor, EMPHASIS));

    // Set the Ctrl+I keystroke.
    // editor.keystrokes.set("CTRL+I", EMPHASIS);
  }
}
