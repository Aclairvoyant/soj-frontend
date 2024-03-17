<template>
  <div id="homeView">
    <a-row class="grid-demo">
      <a-col :span="18">
        <a-carousel
            :style="{ width: '95%', height: '540px' }"
            :auto-play="true"
            animation-name="fade"
            show-arrow="never"
        >
          <a-carousel-item v-for="image in images" :key="image.title">
            <img
                :src="image.url"
                :style="{ width: '100%' }"
            />
          </a-carousel-item>
        </a-carousel>

        <a-list
            class="list-demo-action-layout"
            :bordered="false"
            :data="dataSource"
            :pagination-props="paginationProps"
        >
          <template #item="{ item }">
            <a-list-item class="list-demo-item" action-layout="vertical">
              <template #actions>
                <span><icon-heart />83</span>
                <span><icon-star />{{ item.index }}</span>
                <span><icon-message />Reply</span>
              </template>
              <template #extra>
                <div className="image-area">
                  <img alt="arco-design" :src="item.imageSrc" />
                </div>
              </template>
              <a-list-item-meta
                  :title="item.title"
                  :description="item.description"
              >
                <template #avatar>
                  <a-avatar shape="square">
                    <img alt="avatar" :src="item.avatar" />
                  </a-avatar>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>

        </a-list>
        <a-comment
            author="Socrates"
            avatar="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
            content="Comment body content."
            datetime="1 hour"
        >
          <template #actions>
            <span class="action"> <IconMessage /> Reply </span>
          </template>
          <a-comment
              author="Balzac"
              avatar="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/9eeb1800d9b78349b24682c3518ac4a3.png~tplv-uwbnlip3yd-webp.webp"
              content="Comment body content."
              datetime="1 hour"
          >
            <template #actions>
              <span class="action"> <IconMessage /> Reply </span>
            </template>
            <a-comment
                author="Austen"
                avatar="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/8361eeb82904210b4f55fab888fe8416.png~tplv-uwbnlip3yd-webp.webp"
                content="Reply content"
                datetime="1 hour"
            >
              <template #actions>
                <span class="action"> <IconMessage /> Reply </span>
              </template>
            </a-comment>
            <a-comment
                author="Plato"
                avatar="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
                content="Reply content"
                datetime="1 hour"
            >
              <template #actions>
                <span class="action"> <IconMessage /> Reply </span>
              </template>
            </a-comment>
          </a-comment>
        </a-comment>
      </a-col>

      <a-col :span="6">


        <a-space direction="vertical" fill size="large">
          <a-card :style="{ width: '360px' }" title="公告">
            <template #extra>
              <a-link>More</a-link>
            </template>
            ByteDance's core product, Toutiao ("Headlines"), is a content platform in
            China and around the world. Toutiao started out as a news recommendation
            engine and gradually evolved into a platform delivering content in various
            formats.
            ByteDance's core product, Toutiao ("Headlines"), is a content platform in
            China and around the world. Toutiao started out as a news recommendation
            engine and gradually evolved into a platform delivering content in various
            formats.
          </a-card>
          <a-calendar v-model="value" />
          select: {{value}}
        </a-space>
      </a-col>
    </a-row>


  </div>

</template>


<script setup lang="ts">
import {ref} from "vue";

const images = ref([
  {
    title: "Image 1",
    url: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp",
  },
]);

import { reactive } from 'vue'

const names = ['Socrates', 'Balzac', 'Plato'];
const avatarSrc = [
  '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp',
  '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/e278888093bef8910e829486fb45dd69.png~tplv-uwbnlip3yd-webp.webp',
  '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/9eeb1800d9b78349b24682c3518ac4a3.png~tplv-uwbnlip3yd-webp.webp',
];
const imageSrc = [
  '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/29c1f9d7d17c503c5d7bf4e538cb7c4f.png~tplv-uwbnlip3yd-webp.webp',
  '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/04d7bc31dd67dcdf380bc3f6aa07599f.png~tplv-uwbnlip3yd-webp.webp',
  '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/1f61854a849a076318ed527c8fca1bbf.png~tplv-uwbnlip3yd-webp.webp',
];
const dataSource = new Array(15).fill(null).map((_, index) => {
  return {
    index: index,
    avatar: avatarSrc[index % avatarSrc.length],
    title: names[index % names.length],
    description:
        'Beijing ByteDance Technology Co., Ltd. is an enterprise located in China. ByteDance has products such as TikTok, Toutiao, volcano video and Douyin (the Chinese version of TikTok).',
    imageSrc: imageSrc[index % imageSrc.length],
  };
});

const paginationProps = reactive({
  defaultPageSize: 3,
  total: dataSource.length
});

const value = new Date();



</script>

<style scoped>
#homeView {
  max-width: 1440px;
  margin: 0 auto;
}

.list-demo-action-layout .image-area {
  width: 183px;
  height: 119px;
  border-radius: 2px;
  overflow: hidden;
}

.list-demo-action-layout .list-demo-item {
  padding: 20px 0;
  border-bottom: 1px solid var(--color-fill-3);
}

.list-demo-action-layout .image-area img {
  width: 100%;
}

.list-demo-action-layout .arco-list-item-action .arco-icon {
  margin: 0 4px;
}
</style>

