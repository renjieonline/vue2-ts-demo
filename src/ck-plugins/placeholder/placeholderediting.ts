import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import {
  toWidget,
  viewToModelPositionOutsideModelElement,
} from "@ckeditor/ckeditor5-widget/src/utils";
import Widget from "@ckeditor/ckeditor5-widget/src/widget";

import PlaceholderCommand from "./placeholdercommand";
import "./theme/placeholder.scss";

export default class PlaceholderEditing extends Plugin {
  static get requires(): typeof Widget[] {
    return [Widget];
  }

  init(): void {
    console.log("PlaceholderEditing#init() got called");
    this.defineSchema();
    this.defineConverters();

    this.editor.commands.add(
      "placeholder",
      new PlaceholderCommand(this.editor)
    );

    this.editor.editing.mapper.on(
      "viewToModelPosition",
      viewToModelPositionOutsideModelElement(
        this.editor.model,
        (viewElement: any) => viewElement.hasClass("placeholder")
      )
    );

    this.editor.config.define("placeholderConfig", {
      types: ["date", "first name", "surname"],
    });
  }

  private defineSchema() {
    const schema = this.editor.model.schema;

    schema.register("placeholder", {
      allowWhere: "$text",
      isInline: true,
      isObject: true,
      allowAttributesOf: "$text",
      allowAttributes: ["name"],
    });
  }

  private defineConverters() {
    const conversion = this.editor.conversion;

    const createPlaceholderView = (modelItem: any, viewWriter: any) => {
      const name = modelItem.getAttribute("name");

      const placeholderView = viewWriter.createContainerElement(
        "span",
        {
          class: "placeholder",
        },
        {
          isAllowedInsiderAttributeElement: true,
        }
      );

      const innerText = viewWriter.createText(`{${name}}`);
      viewWriter.insert(
        viewWriter.createPositionAt(placeholderView, 0),
        innerText
      );

      return placeholderView;
    };

    conversion.for("upcast").elementToElement({
      view: {
        name: "span",
        classes: ["placeholder"],
      },
      model: (viewElement: any, { writer: modelWriter }: { writer: any }) => {
        const name = viewElement.getChild(0).data.slice(1, -1);
        return modelWriter.createElement("placeholder", { name });
      },
    });

    conversion.for("editingDowncast").elementToElement({
      model: "placeholder",
      view: (modelItem: any, { writer: viewlWriter }: { writer: any }) => {
        const widgetElement = createPlaceholderView(modelItem, viewlWriter);

        return toWidget(widgetElement, viewlWriter);
      },
    });

    conversion.for("dataDowncast").elementToElement({
      model: "placeholder",
      view: (modelItem: any, { writer: viewWriter }: { writer: any }) =>
        createPlaceholderView(modelItem, viewWriter),
    });
  }
}
