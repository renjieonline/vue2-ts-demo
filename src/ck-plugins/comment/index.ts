import CommentEditing from "./commentediting";
import CommentUI from "./commentui";
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";

export default class Comment extends Plugin {
  static get requires(): (typeof CommentEditing | typeof CommentUI)[] {
    return [CommentEditing, CommentUI];
  }
}
