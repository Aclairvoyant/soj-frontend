<template>
  <div class="question-selector">
    <!-- 搜索和筛选 -->
    <div class="selector-header">
      <a-form :model="searchParams" layout="inline">
        <a-form-item field="title" label="题目标题">
          <a-input
            v-model="searchParams.title"
            placeholder="搜索题目标题"
            allow-clear
            style="width: 200px"
            @press-enter="handleSearch"
          />
        </a-form-item>
        <a-form-item field="tags" label="标签">
          <a-select
            v-model="searchParams.tags"
            placeholder="选择标签"
            multiple
            allow-clear
            style="width: 200px"
          >
            <a-option value="算法">算法</a-option>
            <a-option value="数据结构">数据结构</a-option>
            <a-option value="数学">数学</a-option>
            <a-option value="字符串">字符串</a-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">
            <template #icon>
              <icon-search />
            </template>
            搜索
          </a-button>
          <a-button @click="handleReset" style="margin-left: 8px">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <!-- 题目列表 -->
    <div class="selector-content">
      <a-table
        :data="questions"
        :loading="loading"
        :pagination="{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showTotal: true,
          showJumper: true
        }"
        @page-change="handlePageChange"
        @selection-change="(keys) => {
          console.log('🔄 Table selection-change 被调用')
          console.log('keys:', keys)
          handleSelectionChange(keys)
        }"
        :row-key="'id'"
        :row-selection="{
          type: 'checkbox',
          selectedRowKeys: selectedKeys.map(key => {
            const stringKey = String(key)
            console.log('🔄 渲染selectedRowKeys:', { originalKey: key, stringKey })
            return stringKey
          }),
          onSelect: (rowKey, selected, selectedRows) => {
            console.log('🔄 Table onSelect 被调用')
            console.log('rowKey:', rowKey, 'selected:', selected)
            console.log('selectedRows:', selectedRows.map(r => ({ id: r.id, title: r.title })))
            handleRowSelect(rowKey, selected)
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            console.log('🔄 Table onSelectAll 被调用')
            console.log('selected:', selected)
            console.log('selectedRows:', selectedRows.map(r => ({ id: r.id, title: r.title })))
            console.log('changeRows:', changeRows.map(r => ({ id: r.id, title: r.title })))
            handleSelectAll(selected, selectedRows, changeRows)
          },
          checkStrictly: true
        }"
        class="question-table"
      >
        <template #columns>
          <a-table-column title="ID" data-index="id" width="80" />

          <a-table-column title="题目标题" data-index="title" min-width="200">
            <template #cell="{ record }">
              <div class="question-title-cell">
                <div class="title">{{ record.title }}</div>
                <div class="meta-info">
                  <span class="question-id">ID: {{ record.id }}</span>
                  <div class="tags" v-if="record.tags && record.tags.length">
                    <a-tag v-for="tag in record.tags" :key="tag" size="small">
                      {{ tag }}
                    </a-tag>
                  </div>
                </div>
              </div>
            </template>
          </a-table-column>

          <a-table-column title="难度" data-index="difficulty" width="100" align="center">
            <template #cell="{ record }">
              <a-tag :color="getDifficultyColor(record.difficulty)">
                {{ record.difficulty || '未知' }}
              </a-tag>
            </template>
          </a-table-column>

          <a-table-column title="通过率" width="100" align="center">
            <template #cell="{ record }">
              {{ getAcceptanceRate(record) }}%
            </template>
          </a-table-column>

          <a-table-column title="创建时间" data-index="createTime" width="160">
            <template #cell="{ record }">
              {{ formatDateTime(record.createTime) }}
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>

    <!-- 底部操作 -->
    <div class="selector-footer">
      <div class="selected-info">
        已选择 {{ selectedKeys.length }} 道题目
      </div>
      <div class="footer-actions">
        <a-button @click="handleCancel">取消</a-button>
        <a-button
          type="primary"
          @click="handleConfirm"
          :disabled="selectedKeys.length === 0"
        >
          确认添加
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, withDefaults, defineProps, defineEmits } from 'vue'
import { Message } from '@arco-design/web-vue'
import { Service } from "../../../../generated"
import type { QuestionVO, QuestionQueryRequest } from '../../../../generated'
import moment from 'moment'

interface Props {
  selectedQuestions?: string[]
}

interface Emits {
  (e: 'confirm', questions: QuestionVO[]): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  selectedQuestions: () => []
})

const emit = defineEmits<Emits>()

// 数据状态
const questions = ref<QuestionVO[]>([])
const allSelectedQuestions = ref<Map<string, QuestionVO>>(new Map()) // 存储所有选中的题目
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedKeys = ref<(string | number)[]>([...props.selectedQuestions])

// 搜索参数
const searchParams = reactive<QuestionQueryRequest>({
  title: '',
  tags: [],
  contestOnly: 1, // 只显示比赛题目
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'desc'
})

// 加载题目列表
const loadQuestions = async () => {
  loading.value = true
  try {
    const params = {
      ...searchParams,
      current: currentPage.value,
      pageSize: pageSize.value
    }

    const response = await Service.listMyQuestionVoByPageUsingPost(params)

    if (response.code === 200 && response.data) {
      questions.value = response.data.records || []
      total.value = response.data.total || 0
      
      console.log('📝 API返回的题目数据:')
      console.log('总数:', total.value)
      console.log('题目列表:', questions.value)
      console.log('题目详情:', questions.value.map(q => ({ 
        id: q.id, 
        title: q.title, 
        idType: typeof q.id,
        allKeys: Object.keys(q)
      })))
      
      // 将当前页面的题目添加到选中题目映射中（如果已选中）
      console.log('📚 开始同步当前页面题目到Map')
      console.log('当前页面题目:', questions.value.map(q => ({ id: q.id, title: q.title })))
      console.log('当前selectedKeys:', selectedKeys.value)
      
      questions.value.forEach(q => {
        console.log(`检查题目同步: id=${q.id}, title=${q.title}, idType=${typeof q.id}`)
        if (q.id && selectedKeys.value.includes(String(q.id))) {
          allSelectedQuestions.value.set(String(q.id), q)
          console.log('✅ 同步题目到Map:', { id: q.id, title: q.title })
        }
      })
      
      console.log('📚 同步完成，当前选中的keys:', selectedKeys.value)
      console.log('📚 同步完成，Map大小:', allSelectedQuestions.value.size)
      console.log('📚 同步完成，Map内容:', Array.from(allSelectedQuestions.value.entries()).map(([k, v]) => ({ key: k, title: v.title })))
    } else {
      console.error('❌ API返回错误:')
      console.error('response.code:', response.code)
      console.error('response.message:', response.message)
      console.error('response.data:', response.data)
      Message.error(response.message || '获取题目列表失败')
    }
  } catch (error) {
    console.error('❌ 请求异常:', error)
    Message.error('获取题目列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadQuestions()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchParams, {
    title: '',
    tags: [],
    contestOnly: 1 // 保持比赛题目过滤
  })
  handleSearch()
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadQuestions()
}

// 选择变化处理 - 统一处理函数
const handleSelectionChange = (keys: (string | number)[]) => {
  console.log('🔄 handleSelectionChange 被调用')
  console.log('传入的keys:', keys)
  console.log('传入的keys类型:', keys.map(k => typeof k))
  
  const stringKeys = keys.map(k => String(k))
  selectedKeys.value = stringKeys
  
  console.log('转换后的stringKeys:', stringKeys)
  console.log('当前questions.value:', questions.value.map(q => ({ id: q.id, title: q.title })))
  
  // 同步更新 allSelectedQuestions Map
  const newMap = new Map<string, QuestionVO>()
  stringKeys.forEach(key => {
    const question = questions.value.find(q => String(q.id) === key) || allSelectedQuestions.value.get(key)
    console.log(`寻找key=${key}的题目:`, question ? { id: question.id, title: question.title } : 'NOT FOUND')
    if (question) {
      newMap.set(key, question)
    }
  })
  allSelectedQuestions.value = newMap
  
  console.log('✅ 选择变化处理完成')
  console.log('最终selectedKeys:', selectedKeys.value)
  console.log('最终allSelectedQuestions Map大小:', allSelectedQuestions.value.size)
  console.log('最终allSelectedQuestions Map内容:', Array.from(allSelectedQuestions.value.entries()).map(([k, v]) => ({ key: k, title: v.title })))
  console.log('---')
}

// 单行选择处理
const handleRowSelect = (rowKey: string | number, selected: boolean) => {
  console.log('🎯 handleRowSelect 被调用')
  console.log('rowKey:', rowKey, '类型:', typeof rowKey)
  console.log('selected:', selected)
  
  const key = String(rowKey) // 统一转换为字符串
  const question = questions.value.find(q => String(q.id) === key)
  
  console.log('转换后的key:', key)
  console.log('找到的question:', question ? { id: question.id, title: question.title } : 'NOT FOUND')
  
  if (selected) {
    if (!selectedKeys.value.includes(key)) {
      selectedKeys.value.push(key)
      console.log('✅ 添加到selectedKeys:', key)
    } else {
      console.log('⚠️ key已存在于selectedKeys中:', key)
    }
    // 将题目信息存储到映射中
    if (question) {
      allSelectedQuestions.value.set(key, question)
      console.log('✅ 添加到allSelectedQuestions Map:', key)
    }
  } else {
    const index = selectedKeys.value.indexOf(key)
    if (index > -1) {
      selectedKeys.value.splice(index, 1)
      console.log('✅ 从selectedKeys移除:', key)
    }
    // 从映射中移除题目信息
    allSelectedQuestions.value.delete(key)
    console.log('✅ 从allSelectedQuestions Map移除:', key)
  }
  
  console.log('🔚 handleRowSelect 完成')
  console.log('selectedKeys:', selectedKeys.value)
  console.log('allSelectedQuestions Map大小:', allSelectedQuestions.value.size)
  console.log('---')
}

// 全选处理
const handleSelectAll = (selected: boolean, _selectedRows: any[], changeRows: any[]) => {
  console.log('🎯 handleSelectAll 被调用')
  console.log('selected:', selected)
  console.log('changeRows:', changeRows.map(r => ({ id: r.id, title: r.title })))
  
  if (selected) {
    // 全选：添加当前页面所有未选中的记录
    changeRows.forEach(row => {
      const key = String(row.id)
      console.log('处理全选row:', { id: row.id, title: row.title, key })
      if (!selectedKeys.value.includes(key)) {
        selectedKeys.value.push(key)
        allSelectedQuestions.value.set(key, row)
        console.log('✅ 全选添加:', key)
      } else {
        console.log('⚠️ 全选时key已存在:', key)
      }
    })
  } else {
    // 取消全选：移除当前页面所有选中的记录
    changeRows.forEach(row => {
      const key = String(row.id)
      const index = selectedKeys.value.indexOf(key)
      if (index > -1) {
        selectedKeys.value.splice(index, 1)
        allSelectedQuestions.value.delete(key)
        console.log('✅ 全选移除:', key)
      }
    })
  }
  console.log('🔚 handleSelectAll 完成')
  console.log('selectedKeys:', selectedKeys.value)
  console.log('allSelectedQuestions Map大小:', allSelectedQuestions.value.size)
  console.log('---')
}

// 确认选择
const handleConfirm = () => {
  console.log('🚀 handleConfirm 被调用')
  console.log('当前selectedKeys:', selectedKeys.value)
  console.log('当前allSelectedQuestions Map大小:', allSelectedQuestions.value.size)
  console.log('当前allSelectedQuestions Map内容:', Array.from(allSelectedQuestions.value.entries()).map(([k, v]) => ({ key: k, id: v.id, title: v.title })))

  // 从映射中获取所有选中的题目
  const selectedQuestions: QuestionVO[] = []
  selectedKeys.value.forEach(key => {
    const question = allSelectedQuestions.value.get(String(key))
    console.log(`获取key=${key}的题目:`, question ? { id: question.id, title: question.title } : 'NOT FOUND')
    if (question) {
      selectedQuestions.push(question)
    }
  })
  
  console.log('🎉 最终选中的题目数量:', selectedQuestions.length)
  console.log('🎉 最终选中的题目详情:', selectedQuestions.map(q => ({ id: q.id, title: q.title })))
  
  console.log('🔄 即将emit confirm事件')
  emit('confirm', selectedQuestions)
  console.log('✅ emit confirm事件完成')
}

// 取消选择
const handleCancel = () => {
  emit('cancel')
}

// 工具函数
const getDifficultyColor = (difficulty?: string) => {
  const colorMap: Record<string, string> = {
    '简单': 'green',
    '中等': 'orange',
    '困难': 'red'
  }
  return colorMap[difficulty || ''] || 'gray'
}

const getAcceptanceRate = (_question: QuestionVO) => {
  // TODO: 计算实际通过率
  return Math.floor(Math.random() * 100)
}

const formatDateTime = (dateTime?: string) => {
  return dateTime ? moment(dateTime).format('YYYY-MM-DD') : '-'
}

// 页面加载
onMounted(() => {
  console.log('🚀 QuestionSelector mounted')
  console.log('初始化props.selectedQuestions:', props.selectedQuestions)
  console.log('初始化selectedKeys:', selectedKeys.value)
  loadQuestions()
})
</script>

<style scoped lang="less">
.question-selector {
  .selector-header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e5e6eb;

    .arco-form-item {
      margin-bottom: 0;
    }
  }

  .selector-content {
    margin-bottom: 24px;

    .question-table {
      .question-title-cell {
        .title {
          font-weight: 500;
          color: #1d2129;
          margin-bottom: 4px;
        }

        .tags {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .meta-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 4px;

          .question-id {
            font-size: 12px;
            color: #86909c;
            font-family: monospace;
          }
        }
      }
    }
  }

  .selector-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid #e5e6eb;

    .selected-info {
      color: #165dff;
      font-weight: 500;
    }

    .footer-actions {
      display: flex;
      gap: 12px;
    }
  }
}

@media (max-width: 768px) {
  .question-selector {
    .selector-header {
      .arco-form {
        flex-direction: column;

        .arco-form-item {
          width: 100%;
          margin-bottom: 16px;
        }
      }
    }

    .selector-footer {
      flex-direction: column;
      gap: 16px;

      .footer-actions {
        width: 100%;
        justify-content: space-between;
      }
    }
  }
}
</style>
