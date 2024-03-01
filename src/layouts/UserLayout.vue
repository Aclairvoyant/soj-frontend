<template>
  <div id="userLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <a-space>
          <img src="../assets/oj-logow.png" class="logo" />
          <div>SOJ</div>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer"> Hello World!</a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#userLayout {
  text-align: center;
}

#userLayout .logo {
  width: 64px;
  height: 64px;
}

#userLayout .header {
  background-color: #fff;
  line-height: 40px;
  margin-top: 16px;
  //box-shadow: #eee 1px 1px 5px;
}

#userLayout .content {
  min-height: 280px;
  background-color: #fff;
  padding: 24px;
  margin-bottom: 16px;
}

#userLayout .footer {
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
</script>
