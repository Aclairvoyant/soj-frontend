<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <GlobalFooter />
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style lang="less" scoped>
#basicLayout {
  background: #f8fafc;
}

#basicLayout .header {
  background-color: transparent;
  line-height: 1;
  margin-bottom: 0;
  padding: 0;
  height: auto;
}

#basicLayout .content {
  min-height: calc(100vh - 70px - 400px); // 减去头部和页脚的高度
  background-color: transparent;
  padding: 0;
  margin-bottom: 0;
}

#basicLayout .footer {
  padding: 0;
  background-color: transparent;
  height: auto;
}
</style>

<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
import GlobalFooter from "@/components/GlobalFooter.vue";
</script>
