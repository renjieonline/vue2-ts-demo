import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";

export default class SimpleBoxUI extends Plugin {
  init(): void {
    console.log("CommentBoxUI#init() got called");

    const editor = this.editor;
    const t = editor.t;

    editor.ui.componentFactory.add("commentBox", (locale: any) => {
      const command = editor.commands.get("insertCommentBox");

      const buttonView = new ButtonView(locale);

      buttonView.set({
        // The t() function helps localize the editor. All strings enclosed in t() can be
        // translated and change when the language of the editor changes.
        label: t("Comment Box"),
        withText: true,
        tooltip: true,
      });

      // Bind the state of the button to the command.
      buttonView.bind("isOn", "isEnabled").to(command, "value", "isEnabled");

      // Execute the command when the button is clicked (executed).
      this.listenTo(buttonView, "execute", () =>
        editor.execute("insertCommentBox")
      );

      return buttonView;
    });
  }
}
