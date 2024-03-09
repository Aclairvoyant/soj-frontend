<template>
  <MdPreview :modelValue="value"
             :show-code-row-number="true"
  />
</template>

<script setup>
import {ref} from 'vue';
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';

const value = ref("");
</script>
