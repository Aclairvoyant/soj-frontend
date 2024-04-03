<template>
  <a-list
    class="list-demo-action-layout"
    :bordered="false"
    :data="posts"
    :pagination-props="paginationProps"
  >
    <a-list-item
      class="list-demo-item"
      action-layout="vertical"
      v-for="post in posts"
      :key="post.id"
    >
      <template #actions>
        <span class="action" key="heart" @click="onLikeChange(post.id)">
          <span v-if="post.liked">
            <IconHeartFill :style="{ color: '#f53f3f' }" />
          </span>
          <span v-else>
            <IconHeart />
          </span>
          {{ post.thumbNum }}
        </span>
        <span class="action" key="star" @click="onStarChange(post.id)">
          <span v-if="post.starred">
            <IconStarFill :style="{ color: '#ffb400' }" />
          </span>
          <span v-else>
            <IconStar />
          </span>
          {{ post.favourNum }}
        </span>
        <span @click="goToPostDetail(post)"><icon-detail />查看详情</span>
      </template>
      <template #extra>
        <div class="image-area">
          <img alt="arco-design" :src="post.userAvatar" />
        </div>
      </template>
      <a-list-item-meta :title="post.title" :description="post.content">
        <template #avatar>
          <a-avatar shape="square">
            <img alt="avatar" :src="post.user?.userAvatar" />
          </a-avatar>
        </template>
      </a-list-item-meta>
    </a-list-item>
  </a-list>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  Post,
  PostControllerService,
  PostFavourControllerService,
  PostThumbControllerService, Service,
} from "../../../generated";
import { useRouter } from "vue-router";

const posts = ref([]);


const fetchPostsAndCheckStatus = async () => {
  const res = await Service.listPostVoByPageUsingPost({
    current: 1,
    pageSize: 10,
  });

  if (res.code === 200) {
    // 初始化帖子列表，为每个帖子增加 liked 和 starred 属性
    posts.value = res.data?.records.map((post: any) => ({
      ...post,
      liked: false,
      starred: false,
    }));

    // 为每个帖子检查点赞和收藏状态
    await Promise.all(
      posts.value.map(async (post) => {
        await checkLike(post.id, post);
        await checkStar(post.id, post);
      })
    );
  }
};

const checkLike = async (id: any, post: any) => {
  const res = await Service.checkThumbUsingPost(id);
  // 直接在对应帖子对象上更新状态
  post.liked = res.data;
};

const checkStar = async (id: any, post: any) => {
  const res = await Service.checkFavourUsingPost(id);
  // 直接在对应帖子对象上更新状态
  post.starred = res.data;
};

const onLikeChange = async (id: any) => {
  await Service.doThumbUsingPost({
    postId: id,
  });
  // 再次检查更新点赞状态
  const post = posts.value.find((post) => post.id === id);
  if (post) {
    await checkLike(id, post);
  }
};

const onStarChange = async (id: any) => {
  await Service.doPostFavourUsingPost({
    postId: id,
  });
  // 再次检查更新收藏状态
  const post = posts.value.find((post) => post.id === id);
  if (post) {
    await checkStar(id, post);
  }
};

onMounted(async () => {
  await fetchPostsAndCheckStatus();
})

const router = useRouter();
const goToPostDetail = (post: Post) => {
  router.push({
    path: `/post/${post.id}`,
  });
};

const paginationProps = ref({
  defaultPageSize: 10,
  total: posts.value.length,
});
</script>

<style scoped>
.list-demo-action-layout {
  height: 100%;
  margin: 0;
  padding: 0;
  width: 100%;
}
/* 使PostView的直接父级和列有足够的高度 */
.a-space-vertical {
  min-height: 100vh; /* 举例，可以根据实际需要调整 */
}

.a-col {
  min-height: 100vh; /* 同样，根据需要调整 */
}
</style>
