import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import {
  addListToDropdown,
  createDropdown,
} from "@ckeditor/ckeditor5-ui/src/dropdown/utils";
import Collection from "@ckeditor/ckeditor5-utils/src/collection";
import Model from "@ckeditor/ckeditor5-ui/src/model";

export default class PlaceholderUI extends Plugin {
  init(): void {
    console.log("PlaceholderUI#init() got called");
    const editor = this.editor;
    const t = editor.t;
    const placeholderNames = editor.config.get("placeholderConfig.types");

    editor.ui.componentFactory.add("placeholder", (locale: any) => {
      const dropdownView = createDropdown(locale);

      addListToDropdown(
        dropdownView,
        this.getDropdownItemsDefinitions(placeholderNames)
      );

      dropdownView.buttonView.set({
        label: t("Placeholder"),
        tooltip: true,
        withText: true,
      });

      const command = editor.commands.get("placeholder");
      dropdownView.bind("isEnabled").to(command);

      this.listenTo(dropdownView, "execute", (evt: any) => {
        editor.execute("placeholder", { value: evt.source.commandParams });
        editor.editing.view.focus();
      });

      return dropdownView;
    });
  }

  private getDropdownItemsDefinitions(placeholderNames: string[]): void {
    const itemDefinitions = new Collection();

    for (const name of placeholderNames) {
      const definition = {
        type: "button",
        model: new Model({
          commandParams: name,
          label: name,
          withText: true,
        }),
      };

      itemDefinitions.add(definition);
    }

    return itemDefinitions;
  }
}
