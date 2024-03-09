<template>
  <MdEditor
      v-model="value"
      :show-code-row-number="true"
      @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const value = ref('');

const handleChange = (v: string) => {
  value.value = v;
};

</script>

<style>
.md-editor-toolbar-item:last-child {
  display: none;
}
</style>
