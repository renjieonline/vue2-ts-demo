import SimpleBoxEditing from "./simpleboxediting";
import SimpleBoxUI from "./simpleboxui";
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";

export default class SimpleBox extends Plugin {
  static get requires(): (typeof SimpleBoxEditing | typeof SimpleBoxUI)[] {
    return [SimpleBoxEditing, SimpleBoxUI];
  }
}
