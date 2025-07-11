<template>
  <div class="announcement-list-container">
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <icon-notification class="header-icon" />
          <div class="title-info">
            <h2>系统公告</h2>
            <p class="subtitle">最新消息与重要通知</p>
          </div>
        </div>
        <div class="header-actions">
          <a-space>
            <a-button @click="refreshAnnouncements" :loading="loading">
              <template #icon>
                <icon-refresh />
              </template>
              刷新
            </a-button>
            <a-button type="primary" @click="showAllAnnouncements">
              <template #icon>
                <icon-list />
              </template>
              全部公告
            </a-button>
          </a-space>
        </div>
      </div>
    </div>

    <div class="content-area">
      <!-- 筛选栏 -->
      <div class="filter-section">
        <a-card class="filter-card" :bordered="false">
          <a-row :gutter="16">
            <a-col :xl="8" :lg="12" :md="24" :sm="24">
              <a-form-item label="搜索公告" class="filter-item">
                <a-input
                  v-model="searchForm.keyword"
                  placeholder="请输入公告标题或内容关键字"
                  allow-clear
                  @change="handleSearch"
                >
                  <template #prefix>
                    <icon-search class="input-icon" />
                  </template>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="8" :lg="12" :md="24" :sm="24">
              <a-form-item label="时间范围" class="filter-item">
                <a-range-picker
                  v-model="searchForm.dateRange"
                  format="YYYY-MM-DD"
                  placeholder="['开始时间', '结束时间']"
                  @change="handleSearch"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :xl="8" :lg="12" :md="24" :sm="24">
              <a-form-item label="排序方式" class="filter-item">
                <a-select
                  v-model="searchForm.sortBy"
                  placeholder="请选择排序方式"
                  @change="handleSearch"
                >
                  <a-option value="createTime">发布时间</a-option>
                  <a-option value="updateTime">更新时间</a-option>
                  <a-option value="title">标题</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
      </div>

      <!-- 公告列表 -->
      <div class="announcement-list">
        <!-- 置顶公告 -->
        <div v-if="pinnedAnnouncements.length > 0" class="pinned-section">
          <div class="section-header">
            <div class="section-title">
              <icon-pushpin class="section-icon" />
              <span>置顶公告</span>
            </div>
          </div>
          <div class="announcement-grid">
            <div
              v-for="announcement in pinnedAnnouncements"
              :key="announcement.id"
              class="announcement-card pinned"
              @click="viewAnnouncement(announcement)"
            >
              <div class="card-header">
                <div class="card-badge pinned-badge">
                  <icon-pushpin />
                  <span>置顶</span>
                </div>
                <div class="card-time">
                  {{ formatTime(announcement.createTime) }}
                </div>
              </div>
              <div class="card-content">
                <h3 class="card-title">{{ announcement.title }}</h3>
                <p class="card-summary">{{ getContentSummary(announcement.content) }}</p>
              </div>
              <div class="card-footer">
                <div class="card-meta">
                  <span class="card-author">
                    <icon-user />
                    {{ announcement.user?.userName || '管理员' }}
                  </span>
                  <span class="card-views">
                    <icon-eye />
                    {{ announcement.views || 0 }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 普通公告 -->
        <div class="normal-section">
          <div class="section-header">
            <div class="section-title">
              <icon-notification class="section-icon" />
              <span>最新公告</span>
              <a-badge :count="pagination.total" class="total-badge" />
            </div>
            <div class="section-actions">
              <a-radio-group v-model="viewMode" @change="handleViewModeChange">
                <a-radio-button value="grid">
                  <icon-grid />
                  卡片
                </a-radio-button>
                <a-radio-button value="list">
                  <icon-list />
                  列表
                </a-radio-button>
              </a-radio-group>
            </div>
          </div>
          
          <!-- 卡片视图 -->
          <div v-if="viewMode === 'grid'" class="announcement-grid">
            <div
              v-for="announcement in announcements"
              :key="announcement.id"
              class="announcement-card"
              @click="viewAnnouncement(announcement)"
            >
              <div class="card-header">
                <div class="card-badge">
                  <icon-notification />
                  <span>公告</span>
                </div>
                <div class="card-time">
                  {{ formatTime(announcement.createTime) }}
                </div>
              </div>
              <div class="card-content">
                <h3 class="card-title">{{ announcement.title }}</h3>
                <p class="card-summary">{{ getContentSummary(announcement.content) }}</p>
              </div>
              <div class="card-footer">
                <div class="card-meta">
                  <span class="card-author">
                    <icon-user />
                    {{ announcement.user?.userName || '管理员' }}
                  </span>
                  <span class="card-views">
                    <icon-eye />
                    {{ announcement.views || 0 }}
                  </span>
                </div>
                <div class="card-actions">
                  <a-button type="text" size="small" @click.stop="viewAnnouncement(announcement)">
                    查看详情
                  </a-button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 列表视图 -->
          <div v-if="viewMode === 'list'" class="announcement-list-view">
            <div
              v-for="announcement in announcements"
              :key="announcement.id"
              class="announcement-item"
              @click="viewAnnouncement(announcement)"
            >
              <div class="item-icon">
                <icon-notification />
              </div>
              <div class="item-content">
                <div class="item-header">
                  <h3 class="item-title">{{ announcement.title }}</h3>
                  <div class="item-time">{{ formatTime(announcement.createTime) }}</div>
                </div>
                <p class="item-summary">{{ getContentSummary(announcement.content) }}</p>
                <div class="item-meta">
                  <span class="item-author">
                    <icon-user />
                    {{ announcement.user?.userName || '管理员' }}
                  </span>
                  <span class="item-views">
                    <icon-eye />
                    {{ announcement.views || 0 }}
                  </span>
                </div>
              </div>
              <div class="item-actions">
                <a-button type="text" size="small" @click.stop="viewAnnouncement(announcement)">
                  <icon-arrow-right />
                </a-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && announcements.length === 0" class="empty-state">
          <div class="empty-icon">
            <icon-notification />
          </div>
          <div class="empty-content">
            <h3>暂无公告</h3>
            <p>目前没有可显示的公告信息</p>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <a-spin size="large" />
          <p>正在加载公告...</p>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="pagination.total > 0" class="pagination-section">
        <a-pagination
          v-model:current="pagination.current"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :show-total="true"
          :show-jumper="true"
          :show-page-size="true"
          :page-size-options="['12', '24', '48', '96']"
          @change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        />
      </div>
    </div>

    <!-- 公告详情弹窗 -->
    <a-modal
      v-model:visible="detailModalVisible"
      :title="currentAnnouncement?.title"
      width="900px"
      class="announcement-detail-modal"
      :footer="false"
    >
      <div v-if="currentAnnouncement" class="announcement-detail">
        <div class="detail-header">
          <div class="detail-meta">
            <div class="detail-badge">
              <icon-notification />
              <span>公告</span>
            </div>
            <div class="detail-info">
              <span class="detail-author">
                <icon-user />
                {{ currentAnnouncement.user?.userName || '管理员' }}
              </span>
              <span class="detail-time">
                <icon-clock-circle />
                {{ formatTime(currentAnnouncement.createTime) }}
              </span>
              <span class="detail-views">
                <icon-eye />
                {{ currentAnnouncement.views || 0 }}
              </span>
            </div>
          </div>
        </div>
        <div class="detail-content">
          <MdViewerV3 :value="currentAnnouncement.content" />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import {
  IconNotification,
  IconRefresh,
  IconList,
  IconSearch,
  IconPushpin,
  IconUser,
  IconEye,
  IconGrid,
  IconArrowRight,
  IconClockCircle
} from '@arco-design/web-vue/es/icon'
import moment from 'moment'
import { Service } from '../../../generated'
import type { Announcement } from '../../../generated'
import MdViewerV3 from '@/components/MdViewerV3.vue'

const router = useRouter()

const loading = ref(false)
const detailModalVisible = ref(false)
const currentAnnouncement = ref<Announcement | null>(null)
const viewMode = ref('grid')

const announcements = ref<Announcement[]>([])
const pinnedAnnouncements = ref<Announcement[]>([])

const searchForm = reactive({
  keyword: '',
  dateRange: undefined as [string, string] | undefined,
  sortBy: 'createTime'
})

const pagination = reactive({
  current: 1,
  pageSize: 12,
  total: 0
})

const loadAnnouncements = async () => {
  loading.value = true
  try {
    const res = await Service.getAllVisibleUsingGet()
    if (res.code === 200 && res.data) {
      let filteredData = res.data

      // 应用筛选条件
      if (searchForm.keyword) {
        const keyword = searchForm.keyword.toLowerCase()
        filteredData = filteredData.filter(item => 
          item.title?.toLowerCase().includes(keyword) ||
          item.content?.toLowerCase().includes(keyword)
        )
      }

      if (searchForm.dateRange && searchForm.dateRange.length === 2) {
        const [startDate, endDate] = searchForm.dateRange
        filteredData = filteredData.filter(item => {
          if (!item.createTime) return false
          const createDate = moment(item.createTime).format('YYYY-MM-DD')
          return createDate >= startDate && createDate <= endDate
        })
      }

      // 排序
      filteredData.sort((a, b) => {
        if (searchForm.sortBy === 'createTime') {
          return moment(b.createTime).valueOf() - moment(a.createTime).valueOf()
        } else if (searchForm.sortBy === 'updateTime') {
          return moment(b.updateTime).valueOf() - moment(a.updateTime).valueOf()
        } else if (searchForm.sortBy === 'title') {
          return (a.title || '').localeCompare(b.title || '')
        }
        return 0
      })

      // 分离置顶和普通公告
      pinnedAnnouncements.value = filteredData.filter(item => item.pinned).slice(0, 3)
      const normalAnnouncements = filteredData.filter(item => !item.pinned)

      // 分页
      const startIndex = (pagination.current - 1) * pagination.pageSize
      const endIndex = startIndex + pagination.pageSize
      announcements.value = normalAnnouncements.slice(startIndex, endIndex)
      pagination.total = normalAnnouncements.length
    }
  } catch (error) {
    console.error('加载公告失败:', error)
    Message.error('加载公告失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  loadAnnouncements()
}

const handlePageChange = (page: number) => {
  pagination.current = page
  loadAnnouncements()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  loadAnnouncements()
}

const handleViewModeChange = () => {
  // 视图模式切换时可能需要重新计算布局
}

const refreshAnnouncements = () => {
  loadAnnouncements()
}

const showAllAnnouncements = () => {
  // 显示所有公告或跳转到管理页面
  router.push('/manage/announcement')
}

const viewAnnouncement = (announcement: Announcement) => {
  currentAnnouncement.value = announcement
  detailModalVisible.value = true
}

const formatTime = (time: string | undefined) => {
  if (!time) return ''
  const date = moment(time)
  const now = moment()
  const diff = now.diff(date, 'hours')
  
  if (diff < 1) {
    return '刚刚'
  } else if (diff < 24) {
    return `${diff}小时前`
  } else if (diff < 24 * 7) {
    return `${Math.floor(diff / 24)}天前`
  } else {
    return date.format('YYYY-MM-DD')
  }
}

const getContentSummary = (content: string | undefined) => {
  if (!content) return ''
  // 移除HTML标签和Markdown格式
  const text = content.replace(/<[^>]*>/g, '').replace(/[#*`_~]/g, '')
  return text.length > 120 ? text.substring(0, 120) + '...' : text
}

onMounted(() => {
  loadAnnouncements()
})
</script>

<style lang="less" scoped>
.announcement-list-container {
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
    padding: 24px;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    .header-title {
      display: flex;
      align-items: center;
      gap: 16px;
      
      .header-icon {
        font-size: 32px;
        color: #1890ff;
      }
      
      .title-info {
        h2 {
          margin: 0 0 4px 0;
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
        }
        
        .subtitle {
          margin: 0;
          font-size: 14px;
          color: #86909c;
        }
      }
    }
    
    .header-actions {
      .arco-btn {
        border-radius: 24px;
        font-weight: 500;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }
        
        &.arco-btn-primary {
          background: linear-gradient(135deg, #1890ff, #40a9ff);
          border: none;
          
          &:hover {
            box-shadow: 0 6px 20px rgba(24, 144, 255, 0.3);
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
      }
    }
  }
  
  .announcement-list {
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 20px;
        font-weight: 600;
        color: #1a1a1a;
        
        .section-icon {
          font-size: 24px;
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
      
      .section-actions {
        .arco-radio-group {
          :deep(.arco-radio-button) {
            border-radius: 20px;
            
            &:first-child {
              border-radius: 20px 0 0 20px;
            }
            
            &:last-child {
              border-radius: 0 20px 20px 0;
            }
          }
        }
      }
    }
    
    .announcement-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
      
      .announcement-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        }
        
        &.pinned {
          background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
          border-color: #ffd591;
          
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
            border-radius: 2px 0 0 2px;
          }
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          
          .card-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: rgba(24, 144, 255, 0.1);
            color: #1890ff;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            
            &.pinned-badge {
              background: rgba(250, 140, 22, 0.1);
              color: #fa8c16;
            }
          }
          
          .card-time {
            font-size: 12px;
            color: #86909c;
          }
        }
        
        .card-content {
          margin-bottom: 16px;
          
          .card-title {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0 0 8px 0;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .card-summary {
            font-size: 14px;
            color: #4e5969;
            line-height: 1.5;
            margin: 0;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
        
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .card-meta {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 12px;
            color: #86909c;
            
            .card-author,
            .card-views {
              display: flex;
              align-items: center;
              gap: 4px;
              
              .arco-icon {
                font-size: 14px;
              }
            }
          }
          
          .card-actions {
            .arco-btn {
              color: #1890ff;
              font-size: 12px;
              
              &:hover {
                background: rgba(24, 144, 255, 0.1);
              }
            }
          }
        }
      }
    }
    
    .announcement-list-view {
      .announcement-item {
        display: flex;
        align-items: center;
        gap: 16px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 16px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        .item-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(24, 144, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          
          .arco-icon {
            font-size: 20px;
            color: #1890ff;
          }
        }
        
        .item-content {
          flex: 1;
          
          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            
            .item-title {
              font-size: 16px;
              font-weight: 600;
              color: #1a1a1a;
              margin: 0;
              flex: 1;
            }
            
            .item-time {
              font-size: 12px;
              color: #86909c;
              margin-left: 16px;
            }
          }
          
          .item-summary {
            font-size: 14px;
            color: #4e5969;
            line-height: 1.5;
            margin: 0 0 8px 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .item-meta {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 12px;
            color: #86909c;
            
            .item-author,
            .item-views {
              display: flex;
              align-items: center;
              gap: 4px;
              
              .arco-icon {
                font-size: 14px;
              }
            }
          }
        }
        
        .item-actions {
          flex-shrink: 0;
          
          .arco-btn {
            border-radius: 50%;
            width: 32px;
            height: 32px;
            padding: 0;
            color: #1890ff;
            
            &:hover {
              background: rgba(24, 144, 255, 0.1);
            }
          }
        }
      }
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      
      .empty-icon {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: #f7f8fa;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        color: #c9cdd4;
        font-size: 32px;
      }
      
      .empty-content {
        h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 8px 0;
        }
        
        p {
          font-size: 14px;
          color: #86909c;
          margin: 0;
        }
      }
    }
    
    .loading-state {
      text-align: center;
      padding: 60px 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      
      p {
        font-size: 14px;
        color: #86909c;
        margin: 16px 0 0 0;
      }
    }
  }
  
  .pagination-section {
    display: flex;
    justify-content: flex-end;
    padding: 24px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    margin-top: auto;
    
    .arco-pagination {
      :deep(.arco-pagination-item) {
        border-radius: 8px;
        font-weight: 500;
        
        &.arco-pagination-item-active {
          background: linear-gradient(135deg, #1890ff, #40a9ff);
          border-color: #1890ff;
        }
      }
    }
  }
}

.announcement-detail-modal {
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
    padding-bottom: 16px;
    border-bottom: 2px solid #f0f0f0;
    margin-bottom: 24px;
    
    .detail-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .detail-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(24, 144, 255, 0.1);
        color: #1890ff;
        padding: 6px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 500;
      }
      
      .detail-info {
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 13px;
        color: #86909c;
        
        .detail-author,
        .detail-time,
        .detail-views {
          display: flex;
          align-items: center;
          gap: 4px;
          
          .arco-icon {
            font-size: 14px;
          }
        }
      }
    }
  }
  
  .detail-content {
    line-height: 1.6;
    
    :deep(.md-editor-preview) {
      padding: 0;
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .announcement-list-container {
    .content-area {
      .announcement-list {
        .announcement-grid {
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .announcement-list-container {
    padding: 16px;
    
    .page-header .header-content {
      flex-direction: column;
      gap: 16px;
      text-align: center;
      
      .header-title {
        .title-info {
          text-align: center;
        }
      }
    }
    
    .content-area {
      .filter-section .filter-card {
        .arco-col {
          margin-bottom: 16px;
        }
      }
      
      .announcement-list {
        .section-header {
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }
        
        .announcement-grid {
          grid-template-columns: 1fr;
          gap: 16px;
          
          .announcement-card {
            padding: 16px;
          }
        }
        
        .announcement-list-view {
          .announcement-item {
            padding: 12px;
            
            .item-content {
              .item-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
                
                .item-time {
                  margin-left: 0;
                }
              }
              
              .item-meta {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
              }
            }
          }
        }
      }
    }
  }
}
</style>