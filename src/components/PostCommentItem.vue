<template>
  <div class="comment">
    <a-comment
        :author="comment.userName"
        :avatar="comment.userAvatar"

        :datetime="moment(comment.createTime).format('YYYY-MM-DD HH:mm:ss')"
    >
      <MdViewerV3 :modelValue="comment.content" />
      <template #actions>
        <span class="action" @click="toggleReply"> <IconMessage /> Reply </span>
      </template>
      <a-comment v-if="showReply"
          align="right"
          :avatar="loginUser.userAvatar"
      >
        <template #actions>
          <a-button key="0" type="secondary" @click="toggleReply"> 取消 </a-button>
          <a-button key="1" type="primary" @click="submitReply"> 回复 </a-button>
        </template>
        <template #content>
          <MdEditorV3 v-model="replyContent" />
        </template>
      </a-comment>

      <a-comment>
        <slot></slot>
      </a-comment>


    </a-comment>
  </div>
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue';
import moment from "moment/moment";
import {useStore} from "vuex";
import MdEditorV3 from "@/components/MdEditorV3.vue";
import MdViewerV3 from "@/components/MdViewerV3.vue";
import {Service} from "../../generated";
import {Message} from "@arco-design/web-vue";

const loginUser = useStore().state.user.loginUser;

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
});

const showReply = ref(false);
const replyContent = ref('');


const toggleReply = () => {
  showReply.value = !showReply.value;
};

const submitReply = async () => {
  // 提交回复逻辑...
  // console.log(replyContent.value);
  const res = await Service.addCommentUsingPost({
    content: replyContent.value,
    parentId: props.comment.id,
    postId: props.comment.postId,
  });
  if (res.code === 200) {
    Message.success('回复成功');
    // 清除回复内容
    replyContent.value = '';
    // 关闭回复框
    showReply.value = false;
  } else {
    Message.error('回复失败');
  }

};

</script>

<style scoped>
.comment {
  display: flex;
  align-items: start;
  gap: 10px;
}

.comment-content {
  flex: 1;
}

.nested-comments {
  margin-left: 20px;
}

.action {
  display: inline-block;
  padding: 0 4px;
  color: var(--color-text-1);
  line-height: 24px;
  background: transparent;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.1s ease;
}
.action:hover {
  background: var(--color-fill-3);
}
</style>
