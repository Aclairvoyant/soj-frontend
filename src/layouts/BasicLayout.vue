<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer"> Hello World!</a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#basicLayout {
}

#basicLayout .header {
  background-color: #fff;
  line-height: 40px;
  margin-bottom: 16px;
  //box-shadow: #eee 1px 1px 5px;
}

#basicLayout .content {
  min-height: 280px;
  background-color: #fff;
  padding: 24px;
  margin-bottom: 16px;
}

#basicLayout .footer {
  text-align: center;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: #fff;
}
</style>
<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
</script>
