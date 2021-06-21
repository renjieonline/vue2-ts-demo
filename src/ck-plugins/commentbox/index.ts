import CommentBoxEditing from "./commentboxediting";
import CommentBoxUI from "./commentboxui";
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";

export default class CommentBox extends Plugin {
  static get requires(): (typeof CommentBoxEditing | typeof CommentBoxUI)[] {
    return [CommentBoxEditing, CommentBoxUI];
  }
}
