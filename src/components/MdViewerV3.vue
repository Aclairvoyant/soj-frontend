<template>
  <MdPreview :modelValue="value"
             :show-code-row-number="true"
  />
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from 'vue';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';

interface Props {
  value?: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: ''
});
</script>
