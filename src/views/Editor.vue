<template>
  <div class="editor">
    <button class="button" @click="handleClick">save</button>
    <div class="directory" style="display: block">
      <v-treeview
        activatable
        dense
        open-all
        open-on-click
        return-object
        v-model="title"
        :items="headings"
        @update:active="handleUpdate"
      ></v-treeview>
    </div>
    <div class="left">
      <ckeditor
        style="border: 1px solid #ccc"
        :editor="editor"
        v-model="editorData1"
        @ready="handleEditorReady1"
        :config="editorConfig"
        ref="editor1"
      ></ckeditor>
    </div>
    <div class="right">
      <ckeditor
        style="border: 1px solid #ccc"
        :editor="editor"
        v-model="editorData2"
        @ready="handleEditorReady2"
        :config="editorConfig"
        ref="editor2"
      ></ckeditor>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import CKEditor from "@ckeditor/ckeditor5-vue2";
import { escape2Html } from "@/utils";

import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Clipboard from "@ckeditor/ckeditor5-clipboard/src/clipboard";
// import Comments from "@ckeditor/ckeditor5-comments/src/comments";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";
import ImageReaize from "@ckeditor/ckeditor5-image/src/imageresize";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Link from "@ckeditor/ckeditor5-link/src/link";
import List from "@ckeditor/ckeditor5-list/src/list";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import RemoveFormat from "@ckeditor/ckeditor5-remove-format/src/removeformat";
import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter";
import CKEditroInspector from "@ckeditor/ckeditor5-inspector";
import Outline from "@/ck-plugins/outline";
import SimpleBox from "@/ck-plugins/simplebox";
import Placeholder from "@/ck-plugins/placeholder";
import RemoveFormatLinks from "@/ck-plugins/removeformatlinks";
import CommentBox from "@/ck-plugins/commentbox";
import Comment from "@/ck-plugins/comment";

type OutlineNode = {
  id: number;
  tagNum: string;
  name: string;
  children?: OutlineNode[];
};

@Component({
  components: { ckeditor: CKEditor.component },
})
export default class Editor extends Vue {
  editor = ClassicEditor;
  editorInstance1: typeof ClassicEditor = null;
  editorInstance2: typeof ClassicEditor = null;
  editorData1 = "";
  editorData2 = "";
  editorConfig = {
    commentsOnly: true,
    sidebar: {
      container: document.querySelector(".right"),
    },
    disabled: true,
    simpleUpload: {
      uploadUrl: "https://ecomm-products.modus.workers.dev/",
      withCredentials: false,
    },
    outline: {
      container: ".backup",
    },
    plugins: [
      Outline,
      SimpleBox,
      CommentBox,
      Comment,
      Placeholder,
      Alignment,
      BlockQuote,
      Clipboard,
      // Comments,
      // EasyImage,
      Essentials,
      Image,
      ImageUpload,
      ImageReaize,
      ImageStyle,
      ImageToolbar,
      Heading,
      Bold,
      Italic,
      Link,
      List,
      Paragraph,
      RemoveFormat,
      RemoveFormatLinks,
      SimpleUploadAdapter,
    ],
    heading: {
      options: [
        {
          model: "paragraph",
          title: "正文",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "一级标题",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "二级标题",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "三级标题",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "四级标题",
          class: "ck-heading_heading4",
        },
      ],
    },
    placeholderConfig: {
      types: ["date", "color", "fisrt name", "surname"],
    },
    toolbar: {
      items: [
        "heading",
        "comment",
        "alignment",
        "blockquote",
        "bold",
        "italic",
        "numberedList",
        "bulletedList",
        "link",
        "removeformat",
        "imageupload",
        "simplebox",
        "placeholder",
        "undo",
        "redo",
      ],
    },
    image: {
      toolbar: [
        "imageStyle:alignLeft",
        "imageStyle:alignCenter",
        "imageStyle:alignRight",
        "|",
        "imageResize",
      ],
      styles: [
        {
          name: "alignLeft",
        },
        "alignRight",
        "alignCenter",
      ],
    },
  };
  title = [];

  get headings(): OutlineNode[] {
    const reg = /(?<=<h\d[^>]*?>).*?(?=<\/h(\d)>)/g;
    const result = this.editorData1.matchAll(reg);
    let id = 0;
    const nodes = Array.from(result).map((r) => ({
      id: id++,
      tagNum: r[1],
      name: escape2Html(r[0].replace(/<[^>]+>/g, "")),
    }));
    let res = [];
    if (nodes.length < 2) {
      return nodes;
    }

    let curr: OutlineNode | null = null;
    let prev: OutlineNode = nodes[0];
    const stack = [prev];
    res = [prev];
    for (let i = 1; i < nodes.length; i++) {
      curr = nodes[i];
      while (stack.length) {
        if (curr.tagNum > prev.tagNum) {
          if (!prev.children) prev.children = [];
          prev.children.push(curr);
          stack.push(curr);
          prev = curr;
          break;
        } else {
          stack.pop();
          prev = stack[stack.length - 1];
        }
      }
      if (prev === curr) continue;
      res.push(curr);
      stack.push(curr);
      prev = curr;
    }
    return res;
  }

  get comments(): { id: number; name: string }[] {
    const reg = /(?<=<mark class="comment">).*?(?=<\/mark>)/g;
    const result = this.editorData1.matchAll(reg);
    let id = 0;
    const nodes = Array.from(result).map((r) => ({
      id: id++,
      name: escape2Html(r[0].replace(/<[^>]+>/g, "")),
    }));
    console.log(nodes);
    return nodes;
  }

  @Watch("title")
  handleChangeTitle(val: string): void {
    console.log(val);
  }

  handleUpdate(node: OutlineNode[]): void {
    if (!node[0]) return;
    document.querySelectorAll("h1, h2, h3, h4")[node[0].id].scrollIntoView();
  }

  handleEditorReady1(editor: typeof ClassicEditor): void {
    this.editorInstance1 = editor;
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    this.editorData1 = `
      <h1>Inline editor</h1>
      Inline editor <mark class="comment"> comes </mark>with a floating toolbar that becomes visible when the editor is focused (e.g. by clicking it). Unlike classic editor, inline editor does not render instead of the given element, it simply makes it editable. As a consequence the styles of the edited content will be exactly the same before and after the editor is created.
      <h2>hello</h2>
      A common scenario for using inline editor is offering users the possibility to edit content in its real location on a web page instead of doing it in a separate administration section.
      <h1>Inline editor</h1>
      Inline editor comes with a floating toolbar that becomes visible when the editor is focused (e.g. by clicking it). Unlike classic editor, inline editor does not render instead of the given element, it simply makes it editable. As a consequence the styles of the edited content will be exactly the same before and after the editor is created.
      <h2>hello2</h2>
      A common scenario for using
      <h4>hello4</h4>
      A common scenario for using
      <h2>hello2</h2>
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      <h3>hello3</h3>
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using

       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
       common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
      A common scenario for using
    `;
    CKEditroInspector.attach(editor);

    // editor.execute("placeholder", { value: "time" });

    // this.editorInstance1.model.document.selection.on(
    //   "change:attribute",
    //   (...args: any[]) => {
    //     console.log("123456789", args);
    //   }
    // );
    const commentCommand = editor.commands.get("comment");
    commentCommand.on("execute", (evt: any) => {
      console.log(evt);
      const { selectedText } = evt.source;
      selectedText &&
        this.editorInstance2.execute("insertCommentBox", selectedText);
    });
    // commentCommand.on(
    //   "change:value",
    //   (evt: any, propertyName: string, val: boolean) => {
    //     console.log(evt, propertyName, val);
    //     const { selectedText } = evt.source;
    //     if (val && selectedText) {
    //       this.editorInstance2.execute("insertCommentBox", selectedText);
    //     }
    //   }
    // );
  }
  handleEditorReady2(editor: typeof ClassicEditor): void {
    // this.$set(this.editorConfig, "toolbar", { items: [] });
    this.editorInstance2 = editor;
    editor.editing.view.document.on(
      "change:isFocused",
      (evt: Event, data: any, isFocused: boolean) => {
        console.log(`View document is focused: ${isFocused}`);
      }
    );
    editor.editing.view.focus();
  }

  handleClick(): void {
    // this.editorInstance1.focus();
    console.log("this.editorData1:", this.editorData1);
    // this.editorInstance1.execute("insertCommentBox", "title", "content");
  }
}
</script>
<style scoped lang="scss">
.editor {
  position: relative;
  display: flex;
  width: 100%;
  .button {
    position: absolute;
    left: 0;
    top: 0;
    border: 1px solid seagreen;
  }
  .directory {
    border: 1px solid #ccc;
    min-width: 150px;
    margin-top: 46px;
    margin-bottom: 0;
  }

  .left,
  .right {
    width: 50%;
  }

  :v-deep .ck.ck-reset.ck-editor {
    width: 100%;
    .simple-box {
      padding: 10px;
      margin: 1em 0;

      background: rgba(0, 0, 0, 0.1);
      border: solid 1px hsl(0, 0%, 77%);
      border-radius: 2px;
    }

    .simple-box-title,
    .simple-box-description {
      padding: 10px;
      margin: 0;

      background: #fff;
      border: solid 1px hsl(0, 0%, 77%);
    }

    .simple-box-title {
      margin-bottom: 10px;
    }
  }
}
</style>
