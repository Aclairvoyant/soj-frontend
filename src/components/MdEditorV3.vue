<template>
  <MdEditor
      v-model="value"
      :show-code-row-number="true"
      @change="handleChange"
      @onUploadImg="onUploadImg"
  />
</template>

<script setup lang="ts">

import 'md-editor-v3/lib/style.css';
import {ref} from "vue";
import {Message} from "@arco-design/web-vue";
import { Service} from "../../generated";
import { MdEditor } from 'md-editor-v3';
const value = ref('');

const handleChange = (v: string) => {
  value.value = v;
};


const onUploadImg = async (file: File, callback: (urls: string[]) => void) => {
  const res = await Service.uploadUsingPost(file);
  if (res.code === 200) {
    const imgUrlRes = await Service.getTempAccessUsingPost(res.data);
    // console.log(imgUrlRes.data);
    Message.success('上传成功');
    callback([imgUrlRes.data]);
  } else {
    Message.error('上传失败');
  }
}

</script>

<style>
.md-editor-toolbar-item:last-child {
  display: none;
}
</style>
