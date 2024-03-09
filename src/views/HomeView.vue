<template>
  <div class="home">
<!--    <MdEditor :value="value" :handle-change="onChange"/>-->
<!--    <CodeEditor :value="value" :handle-change="onChange"/>-->
<!--    <MdEditorV3 v-model="value" :handle-change="onChange" />-->
    <MdViewerV3 />
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script setup lang="ts">
import {defineComponent, ref} from "vue";
import HelloWorld from "@/components/HelloWorld.vue";
import MdEditor from "@/components/MdEditor.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import MdEditorV3 from "@/components/MdEditorV3.vue";
import MdViewerV3 from "@/components/MdViewerV3.vue"; // @ is an alias to /src

const value = ref();
const onChange = (v: string) => {
  value.value = v;
};

</script>
