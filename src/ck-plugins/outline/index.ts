import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import OutlineEditing from "./outlineediting";

export default class Outline extends Plugin {
  static get requires(): typeof OutlineEditing[] {
    return [OutlineEditing];
  }
}
