<template>
  <div class="manage-announcement-container">
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <icon-notification class="header-icon" />
          <h2>公告管理</h2>
        </div>
        <div class="header-actions">
          <a-space>
            <a-button type="primary" @click="goToAddAnnouncement">
              <template #icon>
                <icon-plus />
              </template>
              发布公告
            </a-button>
            <a-button @click="refreshData">
              <template #icon>
                <icon-refresh />
              </template>
              刷新
            </a-button>
          </a-space>
        </div>
      </div>
    </div>

    <div class="content-area">
      <div class="filter-section">
        <a-card class="filter-card" :bordered="false">
          <template #title>
            <div class="filter-header">
              <div class="filter-title">
                <icon-filter class="filter-icon" />
                <span>筛选条件</span>
              </div>
            </div>
          </template>

          <a-row :gutter="16" class="filter-form">
            <a-col :xl="6" :lg="8" :md="12" :sm="24">
              <a-form-item label="公告标题" class="filter-item">
                <a-input
                  v-model="searchParams.title"
                  placeholder="请输入公告标题"
                  allow-clear
                >
                  <template #prefix>
                    <icon-file-text class="input-icon" />
                  </template>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="12" :sm="24">
              <a-form-item label="公告内容" class="filter-item">
                <a-input
                  v-model="searchParams.content"
                  placeholder="请输入内容关键词"
                  allow-clear
                >
                  <template #prefix>
                    <icon-book class="input-icon" />
                  </template>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="12" :sm="24">
              <a-form-item label="显示状态" class="filter-item">
                <a-select
                  v-model="searchParams.status"
                  placeholder="请选择状态"
                  allow-clear
                >
                  <a-option :value="0">
                    <div class="option-item">
                      <icon-eye class="status-icon visible" />
                      <span>已展示</span>
                    </div>
                  </a-option>
                  <a-option :value="1">
                    <div class="option-item">
                      <icon-eye-invisible class="status-icon hidden" />
                      <span>已隐藏</span>
                    </div>
                  </a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="12" :sm="24">
              <a-form-item label="操作" class="filter-item">
                <a-space>
                  <a-button type="primary" @click="doSubmit" :loading="loading">
                    <template #icon>
                      <icon-search />
                    </template>
                    搜索
                  </a-button>
                  <a-button @click="resetFilters">
                    <template #icon>
                      <icon-refresh />
                    </template>
                    重置
                  </a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
      </div>

      <div class="table-section">
        <a-card class="table-card" :bordered="false">
          <template #title>
            <div class="table-header">
              <div class="table-title">
                <icon-list class="table-icon" />
                <span>公告列表</span>
                <a-badge :count="total" class="total-badge" />
              </div>
              <div class="table-actions">
                <a-space>
                  <a-tooltip content="导出数据">
                    <a-button type="outline" @click="exportData">
                      <template #icon>
                        <icon-download />
                      </template>
                    </a-button>
                  </a-tooltip>
                  <a-tooltip content="刷新数据">
                    <a-button type="outline" @click="refreshData">
                      <template #icon>
                        <icon-refresh />
                      </template>
                    </a-button>
                  </a-tooltip>
                </a-space>
              </div>
            </div>
          </template>

          <a-table
            :ref="tableRef"
            :columns="columns"
            :data="dataList"
            :loading="loading"
            :pagination="{
              showTotal: true,
              pageSize: searchParams.pageSize,
              current: searchParams.current,
              total,
              showJumper: true,
              showPageSize: true,
              pageSizeOptions: ['10', '20', '50', '100']
            }"
            @page-change="onPageChange"
            @pageSizeChange="onPageSizeChange"
            row-key="id"
            :bordered="false"
            size="large"
            class="modern-table"
            :scroll="{ x: '100%' }"
          >
            <template #status="{ record }">
              <a-tag
                :color="record.status === 0 ? 'green' : 'red'"
                class="status-tag"
              >
                <icon-eye v-if="record.status === 0" />
                <icon-eye-invisible v-else />
                {{ record.status === 0 ? "已展示" : "已隐藏" }}
              </a-tag>
            </template>
            <template #createTime="{ record }">
              <div class="time-cell">
                <icon-clock-circle class="time-icon" />
                {{ moment(record.createTime).utcOffset(8).format("YYYY-MM-DD HH:mm:ss") }}
              </div>
            </template>
            <template #updateTime="{ record }">
              <div class="time-cell">
                <icon-clock-circle class="time-icon" />
                {{ moment(record.updateTime).utcOffset(8).format("YYYY-MM-DD HH:mm:ss") }}
              </div>
            </template>
            <template #content="{ record }">
              <div class="content-cell">
                <div class="content-preview" v-html="getContentPreview(record.content)"></div>
                <a-button type="text" size="small" @click="viewContent(record)">
                  查看详情
                </a-button>
              </div>
            </template>
            <template #optional="{ record }">
              <a-space class="action-buttons">
                <a-button type="text" size="small" @click="viewAnnouncement(record)" class="action-btn view-btn">
                  <template #icon>
                    <icon-eye />
                  </template>
                  查看
                </a-button>
                <a-button type="text" size="small" @click="doUpdate(record)" class="action-btn edit-btn">
                  <template #icon>
                    <icon-edit />
                  </template>
                  修改
                </a-button>
                <a-button
                  type="text"
                  size="small"
                  @click="toggleStatus(record)"
                  :class="['action-btn', record.status === 0 ? 'hide-btn' : 'show-btn']"
                >
                  <template #icon>
                    <icon-eye-invisible v-if="record.status === 0" />
                    <icon-eye v-else />
                  </template>
                  {{ record.status === 0 ? '隐藏' : '显示' }}
                </a-button>
                <a-popconfirm
                  content="确定要删除此公告吗？"
                  type="error"
                  okText="确定"
                  cancelText="取消"
                  @ok="doDelete(record)"
                >
                  <a-button type="text" size="small" status="danger" class="action-btn delete-btn">
                    <template #icon>
                      <icon-delete />
                    </template>
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table>
        </a-card>
      </div>
    </div>

    <!-- 公告详情弹窗 -->
    <a-modal
      v-model:visible="detailModalVisible"
      title="公告详情"
      width="800px"
      class="detail-modal"
      :footer="false"
    >
      <div v-if="currentAnnouncement" class="announcement-detail">
        <div class="detail-header">
          <div class="announcement-title">{{ currentAnnouncement.title }}</div>
          <div class="announcement-meta">
            <a-tag :color="currentAnnouncement.status === 0 ? 'green' : 'red'">
              {{ currentAnnouncement.status === 0 ? '已展示' : '已隐藏' }}
            </a-tag>
            <span class="announcement-time">{{ formatTime(currentAnnouncement.createTime) }}</span>
          </div>
        </div>
        <div class="detail-content">
          <div class="content-section">
            <div class="content-label">
              <icon-file-text />
              公告内容
            </div>
            <div class="content-text" v-html="currentAnnouncement.content"></div>
          </div>
          <div class="author-info" v-if="currentAnnouncement.user">
            <div class="content-label">
              <icon-user />
              发布人
            </div>
            <div class="author-name">{{ currentAnnouncement.user.userName }}</div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import moment from "moment";
import { Announcement, Service } from "../../../generated";
import {
  IconNotification,
  IconPlus,
  IconRefresh,
  IconFilter,
  IconFile,
  IconBook,
  IconEye,
  IconEyeInvisible,
  IconSearch,
  IconList,
  IconDownload,
  IconClockCircle,
  IconEdit,
  IconDelete,
  IconUser
} from '@arco-design/web-vue/es/icon'

const tableRef = ref();
const loading = ref(false);
const detailModalVisible = ref(false);
const currentAnnouncement = ref(null);

const dataList = ref([]);
const total = ref(0);

const searchParams = ref({
  title: "",
  content: "",
  status: undefined,
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  loading.value = true;
  try {
    const res = await Service.listAnnouncementVoByPageUsingPost(searchParams.value);
    if (res.code === 200) {
      dataList.value = res.data?.records ?? [];
      total.value = res.data?.total ?? 0;
    } else {
      Message.error("加载失败，" + res.message);
    }
  } finally {
    loading.value = false;
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

const doSubmit = () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};

const resetFilters = () => {
  searchParams.value = {
    title: "",
    content: "",
    status: undefined,
    pageSize: 10,
    current: 1,
  };
};

const refreshData = () => {
  loadData();
};

const goToAddAnnouncement = () => {
  router.push({
    path: "/add/announcement",
  });
};

const exportData = () => {
  Message.info('导出功能开发中...');
};

const getContentPreview = (content) => {
  if (!content) return '';
  const text = content.replace(/<[^>]*>/g, ''); // 移除HTML标签
  return text.length > 50 ? text.substring(0, 50) + '...' : text;
};

const viewContent = (record) => {
  currentAnnouncement.value = record;
  detailModalVisible.value = true;
};

const viewAnnouncement = (record) => {
  currentAnnouncement.value = record;
  detailModalVisible.value = true;
};

const toggleStatus = async (record) => {
  try {
    const newStatus = record.status === 0 ? 1 : 0;
    const res = await Service.updateAnnouncementUsingPost({
      ...record,
      status: newStatus
    });
    if (res.code === 200) {
      Message.success(newStatus === 0 ? '公告已显示' : '公告已隐藏');
      await loadData();
    } else {
      Message.error('操作失败');
    }
  } catch (error) {
    console.error('切换状态失败:', error);
    Message.error('操作失败');
  }
};

const formatTime = (time) => {
  if (!time) return '';
  return moment(time).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
};

const columns = [
  {
    title: "标题",
    dataIndex: "title",
    width: 200,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "内容",
    slotName: "content",
    width: 300,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "状态",
    slotName: "status",
    width: 100,
    align: 'center',
  },
  {
    title: "用户ID",
    dataIndex: "userId",
    width: 80,
    align: 'center',
  },
  {
    title: "创建时间",
    slotName: "createTime",
    width: 180,
    align: 'center',
  },
  {
    title: "更新时间",
    slotName: "updateTime",
    width: 180,
    align: 'center',
  },
  {
    title: "操作",
    slotName: "optional",
    width: 250,
    align: 'center',
    fixed: 'right',
  },
];
/**
 * 分页
 * @param page
 */
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

/**
 * 分页大小
 * @param size
 */
const onPageSizeChange = (size: number) => {
  searchParams.value = {
    ...searchParams.value,
    pageSize: size,
  };
};

const doDelete = async (announcement: Announcement) => {
  try {
    const res = await Service.deleteAnnouncementUsingPost({
      id: announcement.id,
    });
    if (res.code === 200) {
      Message.success("删除成功");
      await loadData();
    } else {
      Message.error("删除失败");
    }
  } catch (error) {
    console.error('删除失败:', error);
    Message.error("删除失败");
  }
};

const router = useRouter();

const doUpdate = (announcement: Announcement) => {
  router.push({
    path: "/update/announcement",
    query: {
      id: announcement.id,
    },
  });
};
</script>

<style lang="less" scoped>
.manage-announcement-container {
  padding: 24px;
  min-height: calc(100vh - 120px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  margin-bottom: 24px;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 20px 24px;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);

    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;

      .header-icon {
        font-size: 24px;
        color: #1890ff;
      }

      h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: #1a1a1a;
      }
    }

    .header-actions {
      .arco-btn {
        border-radius: 20px;
        font-weight: 500;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        &.arco-btn-primary {
          background: linear-gradient(135deg, #1890ff, #40a9ff);
          border: none;

          &:hover {
            box-shadow: 0 4px 16px rgba(24, 144, 255, 0.3);
          }
        }
      }
    }
  }
}

.content-area {
  .filter-section {
    margin-bottom: 24px;

    .filter-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);

      .filter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        .filter-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #1a1a1a;

          .filter-icon {
            color: #1890ff;
          }
        }
      }

      .filter-form {
        .filter-item {
          margin-bottom: 0;

          .arco-form-item-label {
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
          }

          .input-icon {
            color: #9ca3af;
          }

          .option-item {
            display: flex;
            align-items: center;
            gap: 8px;

            .status-icon {
              &.visible {
                color: #52c41a;
              }
              &.hidden {
                color: #ff4d4f;
              }
            }
          }
        }
      }

      .arco-btn {
        border-radius: 20px;
        font-weight: 500;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        &.arco-btn-primary {
          background: linear-gradient(135deg, #1890ff, #40a9ff);
          border: none;

          &:hover {
            box-shadow: 0 4px 16px rgba(24, 144, 255, 0.3);
          }
        }
      }
    }
  }

  .table-section {
    .table-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);

      .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;

        .table-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #1a1a1a;

          .table-icon {
            color: #1890ff;
          }

          .total-badge {
            :deep(.arco-badge-number) {
              background: linear-gradient(135deg, #1890ff, #40a9ff);
              border: none;
              font-weight: 500;
              border-radius: 12px;
            }
          }
        }

        .table-actions {
          .arco-btn {
            border-radius: 20px;
            transition: all 0.3s ease;

            &:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
          }
        }
      }

      .modern-table {
        .arco-table-th {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-bottom: 2px solid #e5e7eb;
          font-weight: 600;
          color: #374151;
          padding: 16px 12px;
        }

        .arco-table-td {
          padding: 16px 12px;
          border-bottom: 1px solid #f3f4f6;

          &:hover {
            background-color: rgba(24, 144, 255, 0.03);
          }
        }

        .arco-table-tr {
          transition: all 0.2s ease;

          &:hover {
            background-color: rgba(24, 144, 255, 0.05);
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
        }

        .status-tag {
          font-weight: 500;
          border-radius: 12px;
          padding: 4px 12px;
          font-size: 12px;
          display: inline-flex;
          align-items: center;
          gap: 4px;

          .arco-icon {
            font-size: 14px;
          }
        }

        .time-cell {
          font-size: 13px;
          color: #6b7280;
          background: rgba(107, 114, 128, 0.1);
          padding: 6px 12px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 6px;

          .time-icon {
            font-size: 12px;
          }
        }

        .content-cell {
          .content-preview {
            font-size: 13px;
            color: #4b5563;
            line-height: 1.4;
            margin-bottom: 8px;

            :deep(p) {
              margin: 0;
            }
          }
        }

        .action-buttons {
          .action-btn {
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.3s ease;

            &:hover {
              transform: translateY(-1px);
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            &.view-btn:hover {
              color: #1890ff;
              background: rgba(24, 144, 255, 0.1);
            }

            &.edit-btn:hover {
              color: #722ed1;
              background: rgba(114, 46, 209, 0.1);
            }

            &.show-btn:hover {
              color: #52c41a;
              background: rgba(82, 196, 26, 0.1);
            }

            &.hide-btn:hover {
              color: #faad14;
              background: rgba(250, 173, 20, 0.1);
            }

            &.delete-btn:hover {
              background: rgba(255, 77, 79, 0.1);
            }
          }
        }
      }
    }
  }
}

.detail-modal {
  .arco-modal-header {
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    border-bottom: 2px solid #e5e7eb;
    border-radius: 8px 8px 0 0;
  }

  .arco-modal-body {
    padding: 24px;
  }
}

.announcement-detail {
  .detail-header {
    padding-bottom: 20px;
    border-bottom: 2px solid #f0f0f0;
    margin-bottom: 20px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, #1890ff, #40a9ff);
      border-radius: 1px;
    }

    .announcement-title {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 12px;
      line-height: 1.4;
    }

    .announcement-meta {
      display: flex;
      align-items: center;
      gap: 16px;

      .arco-tag {
        font-weight: 500;
        border-radius: 12px;
        padding: 4px 12px;
      }

      .announcement-time {
        font-size: 13px;
        color: #999;
        background: rgba(153, 153, 153, 0.1);
        padding: 4px 12px;
        border-radius: 12px;
      }
    }
  }

  .detail-content {
    .content-section,
    .author-info {
      margin-bottom: 20px;

      .content-label {
        font-size: 13px;
        color: #666;
        margin-bottom: 12px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;

        .arco-icon {
          color: #1890ff;
        }
      }

      .content-text {
        padding: 16px 20px;
        background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        border-radius: 12px;
        line-height: 1.6;
        border: 1px solid rgba(0, 0, 0, 0.05);
        position: relative;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #1890ff, #40a9ff);
          border-radius: 2px 0 0 2px;
        }
      }

      .author-name {
        font-size: 14px;
        color: #1a1a1a;
        font-weight: 500;
        background: rgba(24, 144, 255, 0.1);
        padding: 8px 12px;
        border-radius: 8px;
        display: inline-block;
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .manage-announcement-container {
    .content-area {
      .filter-section .filter-card {
        .filter-form {
          .arco-row {
            .arco-col {
              margin-bottom: 16px;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .manage-announcement-container {
    padding: 16px;

    .page-header .header-content {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }

    .content-area {
      .filter-section .filter-card {
        .filter-header {
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }

        .filter-form {
          .arco-col {
            margin-bottom: 16px;
          }
        }
      }

      .table-section .table-card {
        .table-header {
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }

        .modern-table {
          font-size: 12px;

          .arco-table-th,
          .arco-table-td {
            padding: 8px 6px;
          }

          .action-buttons {
            .action-btn {
              font-size: 11px;
              padding: 2px 6px;
            }
          }
        }
      }
    }
  }
}
</style>
