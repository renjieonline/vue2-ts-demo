import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import {
  toWidget,
  toWidgetEditable,
} from "@ckeditor/ckeditor5-widget/src/utils";
import Widget from "@ckeditor/ckeditor5-widget/src/widget";
import InsertCommentBoxCommand from "./insertcommentboxcommand";
import "./theme/commentbox.scss";

export default class SimpleBoxEditing extends Plugin {
  static get requires(): typeof Widget[] {
    return [Widget];
  }

  init(): void {
    console.log("CommentBoxEditing#init() got called");
    this.defineSchema();
    this.defineConverters();

    this.editor.commands.add(
      "insertCommentBox",
      new InsertCommentBoxCommand(this.editor)
    );
  }

  private defineSchema() {
    const schema = this.editor.model.schema;
    schema.register("commentBox", {
      isObject: true,
      allowWhere: "$block",
    });

    schema.register("commentBoxTitle", {
      isLimit: true,
      allowIn: "commentBox",
      allowContentOf: "$block",
    });

    schema.register("commentBoxContent", {
      isLimit: true,
      allowIn: "commentBox",
      allowContentOf: "$root",
    });

    schema.addChildCheck((context: string, childDefinition: any) => {
      if (
        context.endsWith("commentBoxContent") &&
        childDefinition.name === "commentBox"
      ) {
        return false;
      }
    });
  }

  private defineConverters() {
    const conversion = this.editor.conversion;

    conversion.for("upcast").elementToElement({
      model: "commentBox",
      view: {
        name: "section",
        classes: "comment-box",
      },
    });

    conversion.for("dataDowncast").elementToElement({
      model: "commentBox",
      view: {
        name: "section",
        classes: "comment-box",
      },
    });

    conversion.for("editingDowncast").elementToElement({
      model: "commentBox",
      view: (modelElement: any, { writer: viewWriter }: { writer: any }) => {
        const section = viewWriter.createContainerElement("section", {
          class: "comment-box",
        });

        return toWidget(section, viewWriter, { label: "comment box widget" });
      },
    });

    conversion.for("upcast").elementToElement({
      model: "commentBoxTitle",
      view: {
        name: "h4",
        classes: "comment-box-title",
      },
    });

    conversion.for("dataDowncast").elementToElement({
      model: "commentBoxTitle",
      view: {
        name: "h4",
        classes: "comment-box-title",
      },
    });

    conversion.for("editingDowncast").elementToElement({
      model: "commentBoxTitle",
      view: (modelElement: any, { writer: viewWriter }: { writer: any }) => {
        // Note: You use a more specialized createEditableElement() method here.
        const h4 = viewWriter.createEditableElement("h4", {
          class: "comment-box-title",
        });

        return toWidgetEditable(h4, viewWriter);
      },
    });

    conversion.for("upcast").elementToElement({
      model: "commentBoxContent",
      view: {
        name: "div",
        classes: "comment-box-content",
      },
    });

    conversion.for("dataDowncast").elementToElement({
      model: "commentBoxContent",
      view: {
        name: "div",
        classes: "comment-box-content",
      },
    });

    conversion.for("editingDowncast").elementToElement({
      model: "commentBoxContent",
      view: (modelElement: any, { writer: viewWriter }: { writer: any }) => {
        // Note: You use a more specialized createEditableElement() method here.
        const div = viewWriter.createEditableElement("div", {
          class: "comment-box-content",
        });

        return toWidgetEditable(div, viewWriter);
      },
    });
  }
}
