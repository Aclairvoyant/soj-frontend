<template>
  <MdEditor
      v-model="localValue"
      :show-code-row-number="true"
      @change="handleChange"
      @onUploadImg="onUploadImg"
  />
</template>

<script setup lang="ts">
import 'md-editor-v3/lib/style.css';
import { ref, watch, withDefaults, defineProps, defineEmits } from "vue";
import { Message } from "@arco-design/web-vue";
import { Service } from "../../generated";
import { MdEditor } from 'md-editor-v3';

interface Props {
  modelValue?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: ''
});

const emit = defineEmits<Emits>();

const localValue = ref(props.modelValue);

// Watch for prop changes
watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal;
});

const handleChange = (v: string) => {
  localValue.value = v;
  emit('update:modelValue', v);
};

const onUploadImg = async (file: File, callback: (urls: string[]) => void) => {
  const res = await Service.uploadUsingPost(file);
  if (res.code === 200) {
    const imgUrlRes = await Service.getTempAccessUsingPost(res.data);
    Message.success('上传成功');
    callback([imgUrlRes.data]);
  } else {
    Message.error('上传失败');
  }
};
</script>

<style>
.md-editor-toolbar-item:last-child {
  display: none;
}
</style>
