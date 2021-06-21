import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import italicIcon from "@ckeditor/ckeditor5-basic-styles/theme/icons/italic.svg";

const EMPHASIS = "emphasis";

export default class EmphasisUI extends Plugin {
  init(): void {
    const editor = this.editor;
    const t = editor.t;

    // Add bold button to feature components.
    editor.ui.componentFactory.add(EMPHASIS, (locale: any) => {
      const command = editor.commands.get(EMPHASIS);
      const view = new ButtonView(locale);

      view.set({
        label: t("Emphasis"),
        icon: italicIcon,
        tooltip: true,
        isToggleable: true,
      });

      view.bind("isOn", "isEnabled").to(command, "value", "isEnabled");

      // Execute command.
      this.listenTo(view, "execute", () => {
        editor.execute(EMPHASIS);
        editor.editing.view.focus();
      });

      return view;
    });
  }
}
