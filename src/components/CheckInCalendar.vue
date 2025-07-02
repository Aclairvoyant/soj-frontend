<template>
  <div class="checkin-calendar">
    <!-- 打卡头部 -->
    <div class="checkin-header">
      <div class="header-info">
        <h3 class="title">每日打卡</h3>
        <p class="subtitle">坚持编程，提升技能</p>
      </div>
      <div class="checkin-status">
        <div class="status-icon" :class="{ checked: todayChecked }">
          <icon-check-circle v-if="todayChecked" />
          <icon-clock-circle v-else />
        </div>
        <span class="status-text">{{ todayChecked ? '已打卡' : '未打卡' }}</span>
      </div>
    </div>

    <!-- 打卡按钮 -->
    <div class="checkin-action">
      <a-button 
        type="primary" 
        size="large" 
        :disabled="todayChecked"
        @click="handleCheckIn"
        class="checkin-btn"
        :loading="checking"
      >
        <template #icon>
          <icon-check v-if="!todayChecked" />
          <icon-check-circle v-else />
        </template>
        {{ todayChecked ? '今日已打卡' : '立即打卡' }}
      </a-button>
    </div>

    <!-- 打卡统计 -->
    <div class="checkin-stats">
      <div class="stat-item">
        <div class="stat-number">{{ continuousDays }}</div>
        <div class="stat-label">连续打卡</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ totalDays }}</div>
        <div class="stat-label">总打卡天数</div>
      </div>
    </div>

    <!-- 日历区域 -->
    <div class="calendar-section">
      <div class="calendar-header">
        <h4>打卡记录</h4>
        <div class="calendar-nav">
          <a-button 
            type="text" 
            size="small" 
            @click="previousMonth"
            :disabled="currentMonth <= 0"
          >
            <icon-left />
          </a-button>
          <span class="month-text">{{ currentMonthText }}</span>
          <a-button 
            type="text" 
            size="small" 
            @click="nextMonth"
            :disabled="currentMonth >= 11"
          >
            <icon-right />
          </a-button>
        </div>
      </div>

      <!-- 日历网格 -->
      <div class="calendar-grid">
        <!-- 星期标题 -->
        <div class="weekdays">
          <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
        </div>
        
        <!-- 日期网格 -->
        <div class="days-grid">
          <div 
            v-for="day in calendarDays" 
            :key="day.date"
            class="day-cell"
            :class="{
              'other-month': !day.isCurrentMonth,
              'checked': day.isChecked,
              'today': day.isToday,
              'clickable': day.isCurrentMonth
            }"
            @click="day.isCurrentMonth && handleDayClick(day)"
          >
            <span class="day-number">{{ day.dayNumber }}</span>
            <div v-if="day.isChecked" class="check-mark">
              <icon-check />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 打卡奖励 -->
    <div class="rewards-section" v-if="todayChecked">
      <div class="reward-item">
        <icon-gift class="reward-icon" />
        <div class="reward-info">
          <div class="reward-title">连续打卡奖励</div>
          <div class="reward-desc">获得 {{ continuousDays * 10 }} 积分</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
import { ref, computed, watch } from 'vue';
import { IconCheck, IconCheckCircle, IconClockCircle, IconLeft, IconRight, IconGift } from '@arco-design/web-vue/es/icon';

// Props
const props = defineProps({
  checkInDays: {
    type: Array,
    default: () => []
  },
  todayChecked: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['check-in']);

// 响应式数据
const checking = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

// 星期标题
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

// 计算属性
const currentMonthText = computed(() => {
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', 
                  '七月', '八月', '九月', '十月', '十一月', '十二月'];
  return `${currentYear.value}年 ${months[currentMonth.value]}`;
});

const continuousDays = computed(() => {
  let count = 0;
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // 从今天开始往前计算连续天数
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    if (props.checkInDays.includes(dateStr)) {
      count++;
    } else {
      break;
    }
  }
  
  return count;
});

const totalDays = computed(() => {
  return props.checkInDays.length;
});

const calendarDays = computed(() => {
  const days = [];
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // 生成42天的日历网格（6周）
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    days.push({
      date: dateStr,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === currentMonth.value,
      isChecked: props.checkInDays.includes(dateStr),
      isToday: dateStr === todayStr
    });
  }
  
  return days;
});

// 方法
const handleCheckIn = async () => {
  if (checking.value || props.todayChecked) return;
  
  checking.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
    emit('check-in');
  } finally {
    checking.value = false;
  }
};

const handleDayClick = (day) => {
  // 可以在这里添加点击日期的逻辑
  console.log('点击日期:', day.date);
};

const previousMonth = () => {
  if (currentMonth.value > 0) {
    currentMonth.value--;
  } else {
    currentMonth.value = 11;
    currentYear.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value < 11) {
    currentMonth.value++;
  } else {
    currentMonth.value = 0;
    currentYear.value++;
  }
};

// 监听props变化
watch(() => props.checkInDays, () => {
  // 当打卡数据更新时，可以在这里添加逻辑
}, { deep: true });
</script>

<style lang="less" scoped>
.checkin-calendar {
  padding: 24px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

// 打卡头部
.checkin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-info {
  .title {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 4px 0;
    color: #1d2129;
  }
  
  .subtitle {
    font-size: 14px;
    margin: 0;
    color: #86909c;
  }
}

.checkin-status {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .status-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f2f3f5;
    color: #86909c;
    transition: all 0.3s ease;
    
    &.checked {
      background: #00b42a;
      color: white;
    }
  }
  
  .status-text {
    font-size: 14px;
    font-weight: 500;
    color: #1d2129;
  }
}

// 打卡按钮
.checkin-action {
  margin-bottom: 24px;
  
  .checkin-btn {
    width: 100%;
    height: 48px;
    border-radius: 12px;
    font-weight: 600;
    background: linear-gradient(135deg, #165dff 0%, #4080ff 100%);
    border: none;
    transition: all 0.3s ease;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(22, 93, 255, 0.3);
    }
    
    &:disabled {
      background: #f2f3f5;
      color: #c9cdd4;
    }
  }
}

// 打卡统计
.checkin-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  
  .stat-item {
    flex: 1;
    text-align: center;
    padding: 16px;
    background: #f7f8fa;
    border-radius: 12px;
    transition: all 0.3s ease;
    
    &:hover {
      background: #e8f3ff;
      transform: translateY(-2px);
    }
    
    .stat-number {
      font-size: 24px;
      font-weight: 700;
      color: #165dff;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 12px;
      color: #86909c;
      font-weight: 500;
    }
  }
}

// 日历区域
.calendar-section {
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    h4 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      color: #1d2129;
    }
    
    .calendar-nav {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .month-text {
        font-size: 14px;
        font-weight: 500;
        color: #1d2129;
        min-width: 80px;
        text-align: center;
      }
    }
  }
}

// 日历网格
.calendar-grid {
  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 8px;
    
    .weekday {
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      color: #86909c;
      padding: 8px 4px;
    }
  }
  
  .days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    
    .day-cell {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      .day-number {
        font-size: 14px;
        font-weight: 500;
        color: #1d2129;
        z-index: 1;
      }
      
      .check-mark {
        position: absolute;
        top: 2px;
        right: 2px;
        width: 16px;
        height: 16px;
        background: #00b42a;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
      }
      
      &.other-month {
        .day-number {
          color: #c9cdd4;
        }
      }
      
      &.checked {
        background: #e8f3ff;
        
        .day-number {
          color: #165dff;
          font-weight: 600;
        }
      }
      
      &.today {
        background: #165dff;
        
        .day-number {
          color: white;
          font-weight: 600;
        }
      }
      
      &.clickable:hover {
        background: #f2f3f5;
        transform: scale(1.05);
      }
    }
  }
}

// 奖励区域
.rewards-section {
  margin-top: 24px;
  padding: 16px;
  background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
  border-radius: 12px;
  border: 1px solid #ffd591;
  
  .reward-item {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .reward-icon {
      width: 32px;
      height: 32px;
      color: #fa8c16;
      font-size: 20px;
    }
    
    .reward-info {
      .reward-title {
        font-size: 14px;
        font-weight: 600;
        color: #1d2129;
        margin-bottom: 2px;
      }
      
      .reward-desc {
        font-size: 12px;
        color: #86909c;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .checkin-calendar {
    padding: 16px;
  }
  
  .checkin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .checkin-stats {
    flex-direction: column;
    gap: 12px;
  }
  
  .calendar-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style> 