<template>
  <MdEditor
      v-model="value"
      :show-code-row-number="true"
      @change="handleChange"
      @onUploadImg="onUploadImg2"
  />
</template>

<script setup lang="ts">

import 'md-editor-v3/lib/style.css';
import {ref} from "vue";
import {Message} from "@arco-design/web-vue";
import {FileService, Service} from "../../generated";
import axios from "axios";
import { MdEditor } from 'md-editor-v3';
const value = ref('');

const handleChange = (v: string) => {
  value.value = v;
};

const onUploadImg3 = async (file: File) => {
  const res = await Service.uploadUsingPost(file);
  if (res.code === 200) {
    const imgUrlRes = await Service.getTempAccessUsingPost(res.data);
    console.log(imgUrlRes.data);
  } else {
    Message.error(res.msg);
  }

};

// todo: 上传图片
const onUploadImg2 = async (files: FileList, callback: (urls: string[]) => void) => {
  try {
    // 将FileList转换为数组，因为FileList不是一个数组
    const filesArray = Array.from(files);
    const uploadPromises = filesArray.map(file => {
      const formData = new FormData();
      formData.append('file', file);
      // 假设这里是你的文件上传API
      return axios.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    });

    // 等待所有文件上传完毕
    const responses = await Promise.all(uploadPromises);

    // 假设API返回的响应体中有一个data对象，其中包含图片的URL
    const urls = responses.map(response => response.data.url);

    // 调用回调函数，传入图片URL数组
    callback(urls);
  } catch (error) {
    console.error('图片上传失败', error);
    Message.error('图片上传失败');
  }
};




</script>

<style>
.md-editor-toolbar-item:last-child {
  display: none;
}
</style>
