import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import commentIcon from "./theme/icons/add-comment.svg";

const COMMENT = "comment";

export default class CommentUI extends Plugin {
  init(): void {
    const editor = this.editor;

    // Add bold button to feature components.
    editor.ui.componentFactory.add(COMMENT, () => {
      const command = editor.commands.get(COMMENT);
      const view = new ButtonView();

      view.set({
        label: "批注",
        icon: commentIcon,
        tooltip: true,
        isToggleable: true,
      });

      view.bind("isOn", "isEnabled").to(command, "value", "isEnabled");

      // Execute command.
      this.listenTo(view, "execute", () => {
        editor.execute(COMMENT);
        editor.editing.view.focus();
      });

      return view;
    });
  }
}
