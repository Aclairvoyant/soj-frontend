<template>
  <div class="comments-container">
    <a-comment
        v-for="comment in comments"
        :key="comment.id"
        :author="comment.userName"
        :datetime="moment(comment.createTime).format('YYYY-MM-DD HH:mm:ss')"
    >

      <template #avatar>
        <a-avatar>
          <img alt="avatar" :src="comment.userAvatar" />
        </a-avatar>
      </template>
      <template #content>
        <div>{{ comment.content }}</div>
      </template>
    </a-comment>

  </div>

    <a-comment class="input-container"
        align="right"
    >
      <template #actions>
        <a-button type="primary" @click="submitComment">评论</a-button>
      </template>
      <template #content>
        <a-textarea v-model="commentContent" placeholder="Here is you content." />
      </template>
    </a-comment>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { defineProps } from 'vue';
import {QuestionCommentVO, Service} from "../../generated";
import moment from "moment/moment";

const props = defineProps({
  questionId: {
    type: Number,
    required: true,
  },
});

const comments = ref<QuestionCommentVO[] | undefined>(undefined);

const commentContent = ref();

onMounted(async () => {
  if (props.questionId) {
    const res = await Service.getQuestionCommentUsingGet(props.questionId);
    if (res.code === 200) {
      comments.value = res.data;
    } else {
      comments.value = [];
    }
  }
});

const loadComments = async () => {
  const res = await Service.getQuestionCommentUsingGet(props.questionId);
  if (res.code === 200) {
    comments.value = res.data;
  }
};

const submitComment = async () => {
  if (commentContent.value) {
    const res = await Service.addQuestionCommentUsingPost({
      questionId: props.questionId,
      content: commentContent.value,
    });
    if (res.code === 200) {
      commentContent.value = '';
      await loadComments();
    }
  }
};

</script>


<style scoped>
.comments-container {
  display: inline-block;
  padding: 0 4px;
  color: var(--color-text-1);
  line-height: 24px;
  background: transparent;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.1s ease;
  flex-grow: 1;
  overflow-y: auto;
}

.input-container {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f0f2f5;
}

</style>
