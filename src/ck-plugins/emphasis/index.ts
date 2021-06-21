import EmphasisEditing from "./emphasisediting";
import EmphasisUI from "./emphasisui";
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";

export default class Hilight extends Plugin {
  static get requires(): (typeof EmphasisEditing | typeof EmphasisUI)[] {
    return [EmphasisEditing, EmphasisUI];
  }
}
