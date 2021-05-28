<template>
  <div class="editor">
    <ul class="directory">
      <li v-for="(h, i) in headings" :key="i"><span v-html="h"></span></li>
    </ul>
    <ckeditor
      :editor="editor"
      v-model="editorData"
      @ready="handleEditorReady"
      :config="editorConfig"
      ref="editor"
    ></ckeditor>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
import AutoFormat from "@ckeditor/ckeditor5-autoformat/src/autoformat";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
// import EasyImage from "@ckeditor/ckeditor5-easy-image/src/easyimage";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
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
import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter";
import CKEditroInspector from "@ckeditor/ckeditor5-inspector";
import SimpleBox from "@/ck-plugins/simplebox";
import Placeholder from "@/ck-plugins/placeholder";

@Component
export default class Editor extends Vue {
  editor = ClassicEditor;
  editorInstance: typeof ClassicEditor = null;
  editorData = "";
  editorConfig = {
    simpleUpload: {
      uploadUrl: "https://ecomm-products.modus.workers.dev/",
      withCredentials: false,
    },
    plugins: [
      SimpleBox,
      Placeholder,
      Alignment,
      AutoFormat,
      BlockQuote,
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
          class: "ck-heading_heading1",
        },
      ],
    },
    placeholderConfig: {
      types: ["date", "color", "fisrt name", "surname"],
    },
    toolbar: {
      items: [
        "heading",
        "alignment",
        "autoformat",
        "blockquote",
        "bold",
        "italic",
        "numberedList",
        "bulletedList",
        "link",
        "imageupload",
        "simplebox",
        "placeholder",
        // "comment",
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
  get headings(): RegExpMatchArray | null {
    const reg = /(?<=<h\d[^>]*?>).*?(?=<\/h\d>)/g;
    const result = this.editorData.match(reg);
    return result;
  }
  handleEditorReady(editor: typeof ClassicEditor): void {
    this.editorInstance = editor;
    this.editorData = `
      <p>This is a simple box:</p>

      <section class="simple-box">
          <h1 class="simple-box-title">Box title</h1>
          <div class="simple-box-description">
              <p>The description goes here.</p>
              <ul>
                  <li>It can contain lists,</li>
                  <li>and other block elements like headings.</li>
              </ul>
          </div>
      </section>
    `;
    CKEditroInspector.attach(editor);

    editor.execute("placeholder", { value: "time" });

    // this.editorInstance.model.change((writer: any) => {
    //   writer.insertText(
    //     "foo",
    //     this.editorInstance.model.document.selection.getFirstPosition()
    //   );
    // });
  }
}
</script>
<style scoped lang="scss">
.editor {
  display: flex;
  .directory {
    width: 100px;
  }
  :v-deep .ck.ck-editor {
    flex: 1;
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
