<template>
  <a-col class="banner">
    <a-col>
      <a-typography-title :heading="5" style="margin-top: 0">
        欢迎回来！ {{ store.state.user.loginUser.userName }}
      </a-typography-title>
    </a-col>
    <a-divider class="panel-border" />
  </a-col>
</template>

<script lang="ts" setup>
import store from "../../../store";

</script>

<style scoped lang="less">
.banner {
  width: 100%;
  padding: 20px 20px 0 20px;
  background-color: var(--color-bg-2);
  border-radius: 4px 4px 0 0;
}

:deep(.arco-icon-home) {
  margin-right: 6px;
}
</style>
