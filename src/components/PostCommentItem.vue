<template>
  <div class="comment-container">
    <div class="comment-main">
      <div class="comment-avatar">
        <a-avatar :size="40">
          <img v-if="comment.userAvatar" :src="comment.userAvatar" alt="avatar" />
        </a-avatar>
      </div>

      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-author">{{ comment.userName }}</span>
          <span class="comment-time">{{ formatTime(comment.createTime) }}</span>
        </div>

        <div class="comment-body">
          <MdViewerV3 :value="comment.content" />
        </div>

        <div class="comment-actions">
          <a-button
            type="text"
            size="small"
            @click="toggleReply"
            class="action-btn"
            :class="{ active: showReply }"
          >
            <template #icon>
              <icon-message />
            </template>
            {{ showReply ? '取消回复' : '回复' }}
          </a-button>

          <a-button
            type="text"
            size="small"
            @click="toggleLike"
            class="action-btn like-btn"
            :class="{ liked: isLiked }"
          >
            <template #icon>
              <icon-heart :class="{ 'heart-filled': isLiked }" />
            </template>
            {{ likeCount }}
          </a-button>

          <!-- 折叠/展开子评论按钮 -->
          <a-button
            v-if="comment.children && comment.children.length > 0"
            type="text"
            size="small"
            @click="toggleCollapse"
            class="action-btn collapse-btn"
            :class="{ collapsed: isCollapsed }"
          >
            <template #icon>
              <icon-down :class="{ 'rotate-180': !isCollapsed }" />
            </template>
            {{ isCollapsed ? '展开' : '折叠' }}{{ comment.children.length }}条回复
          </a-button>
        </div>

        <!-- Reply Form -->
        <div v-if="showReply" class="reply-form">
          <div class="reply-input-container">
            <a-avatar :size="32" class="reply-avatar">
              <img v-if="loginUser.userAvatar" :src="loginUser.userAvatar" alt="avatar" />


            </a-avatar>

            <div class="reply-editor">
              <MdEditorV3
                v-model="replyContent"
                :height="200"
                :toolbars="['bold', 'italic', 'code', 'link', 'quote']"
                placeholder="写下你的回复..."
              />
            </div>
          </div>

          <div class="reply-actions">
            <a-button @click="toggleReply" size="small">
              取消
            </a-button>
            <a-button
              type="primary"
              @click="submitReply"
              size="small"
              :loading="replyLoading"
            >
              <template #icon>
                <icon-send />
              </template>
              发布回复
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Nested Comments - Recursive Rendering -->
    <div v-if="comment.children && comment.children.length > 0 && !isCollapsed" class="nested-comments">
      <PostCommentItem
        v-for="childComment in comment.children"
        :key="childComment.id"
        :comment="childComment"
        :depth="depth + 1"
        class="nested-comment"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed, withDefaults } from 'vue';
import moment from 'moment';
import { useStore } from 'vuex';
import { Message } from '@arco-design/web-vue';
import {
  IconUser,
  IconMessage,
  IconHeart,
  IconSend,
  IconDown
} from '@arco-design/web-vue/es/icon';
import MdEditorV3 from '@/components/MdEditorV3.vue';
import MdViewerV3 from '@/components/MdViewerV3.vue';
import { Service } from '../../generated';

interface Comment {
  id: number;
  content: string;
  userName: string;
  userAvatar?: string;
  createTime: string;
  parentId?: number;
  postId: number;
  children?: Comment[];
}

interface Props {
  comment: Comment;
  depth?: number;
}

const props = withDefaults(defineProps<Props>(), {
  depth: 0
});

const store = useStore();
const loginUser = store.state.user?.loginUser;

const showReply = ref(false);
const replyContent = ref('');
const replyLoading = ref(false);
const isLiked = ref(false);
const likeCount = ref(Math.floor(Math.random() * 10)); // Mock like count
const isCollapsed = ref(false);

const formatTime = (time: string) => {
  const now = moment();
  const commentTime = moment(time);
  const diffMinutes = now.diff(commentTime, 'minutes');

  if (diffMinutes < 1) return '刚刚';
  if (diffMinutes < 60) return `${diffMinutes}分钟前`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}小时前`;
  if (diffMinutes < 10080) return `${Math.floor(diffMinutes / 1440)}天前`;

  return commentTime.format('YYYY-MM-DD HH:mm');
};

const toggleReply = () => {
  showReply.value = !showReply.value;
  if (!showReply.value) {
    replyContent.value = '';
  }
};

const toggleLike = () => {
  isLiked.value = !isLiked.value;
  likeCount.value += isLiked.value ? 1 : -1;
};

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const submitReply = async () => {
  if (!replyContent.value.trim()) {
    Message.warning('回复内容不能为空');
    return;
  }

  replyLoading.value = true;
  try {
    const res = await Service.addCommentUsingPost({
      content: replyContent.value,
      parentId: props.comment.id,
      postId: props.comment.postId,
    });

    if (res.code === 200) {
      Message.success('回复成功');
      replyContent.value = '';
      showReply.value = false;
      // Emit event to parent to refresh comments
      // You might want to add an emit here if needed
    } else {
      Message.error('回复失败');
    }
  } catch (error) {
    Message.error('回复失败');
  } finally {
    replyLoading.value = false;
  }
};

// Calculate indent level for nested comments
const indentLevel = computed(() => {
  return Math.min(props.depth, 5); // Max indent level of 5
});
</script>

<style lang="less" scoped>
.comment-container {
  margin-bottom: 16px;

  &.nested-comment {
    margin-left: calc(v-bind(indentLevel) * 24px);

    .comment-main {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border-left: 3px solid #3b82f6;

      &::before {
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      }
    }
  }
}

.comment-main {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }

  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
    border-color: rgba(59, 130, 246, 0.3);

    &::before {
      opacity: 1;
    }
  }

  > * {
    position: relative;
    z-index: 1;
  }
}

.comment-avatar {
  flex-shrink: 0;

  .arco-avatar {
    border: 2px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
  }
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;

  .comment-author {
    font-weight: 600;
    color: #1e293b;
    font-size: 14px;
  }

  .comment-time {
    font-size: 12px;
    color: #64748b;
    background: rgba(100, 116, 139, 0.1);
    padding: 2px 8px;
    border-radius: 10px;
  }
}

.comment-body {
  margin-bottom: 12px;

  :deep(.md-editor-preview) {
    background: transparent;
    padding: 0;

    p {
      margin: 0 0 8px 0;
      line-height: 1.6;
      color: #374151;
    }

    code {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.9em;
    }

    pre {
      background: rgba(15, 23, 42, 0.95);
      border-radius: 8px;
      padding: 12px;
      margin: 8px 0;

      code {
        color: #e2e8f0;
        background: transparent;
        padding: 0;
      }
    }
  }
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 8px;

  .action-btn {
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &.active {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      border-color: rgba(59, 130, 246, 0.3);
    }

    &.like-btn {
      &.liked {
        color: #ef4444;

        .heart-filled {
          color: #ef4444;
        }
      }

      &:hover {
        color: #ef4444;
      }
    }

    &.collapse-btn {
      color: #6b7280;

      .arco-icon {
        transition: transform 0.3s ease;
      }

      .rotate-180 {
        transform: rotate(180deg);
      }

      &.collapsed {
        color: #3b82f6;
        background: rgba(59, 130, 246, 0.1);
        border-color: rgba(59, 130, 246, 0.3);
      }

      &:hover {
        color: #3b82f6;
        background: rgba(59, 130, 246, 0.05);
      }
    }
  }
}

.reply-form {
  margin-top: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);

  .reply-input-container {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;

    .reply-avatar {
      flex-shrink: 0;
      margin-top: 4px;
    }

    .reply-editor {
      flex: 1;

      :deep(.md-editor) {
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.1);

        .md-editor-header {
          background: #ffffff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .md-editor-input-wrapper {
          background: #ffffff;
        }
      }
    }
  }

  .reply-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;

    .arco-btn {
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.nested-comments {
  margin-top: 16px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -12px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, #e2e8f0, transparent);
    border-radius: 1px;
  }
}

// Responsive design
@media (max-width: 768px) {
  .comment-container {
    &.nested-comment {
      margin-left: calc(v-bind(indentLevel) * 16px);
    }
  }

  .comment-main {
    padding: 12px;
    gap: 8px;
  }

  .comment-avatar {
    .arco-avatar {
      width: 32px;
      height: 32px;
    }
  }

  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .reply-form {
    padding: 12px;

    .reply-input-container {
      flex-direction: column;
      gap: 8px;
    }

    .reply-actions {
      flex-direction: column;

      .arco-btn {
        width: 100%;
      }
    }
  }
}

// Animation for new comments
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.comment-container {
  animation: fadeInUp 0.3s ease-out;
}
</style>
