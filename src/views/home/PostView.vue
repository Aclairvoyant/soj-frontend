<template>
  <a-list
      class="list-demo-action-layout"
      :bordered="false"
      :data="posts"
      :pagination-props="paginationProps"
  >
    <template>
      <a-list-item class="list-demo-item" action-layout="vertical">
        <!-- 列表项内容 -->
      </a-list-item>
    </template>
  </a-list>
</template>

<script setup>
import { ref } from 'vue';

const posts = ref([

]);

const paginationProps = ref({
  defaultPageSize: 3,
  total: posts.value.length,
});
</script>
