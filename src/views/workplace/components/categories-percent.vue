<template>
  <a-card class="analysis-card" :bordered="false">
    <template #title>
      <div class="card-title">
        <icon-info-circle class="card-icon" />
        <span>做题分析</span>
      </div>
    </template>
    <template #extra>
      <a-tag color="blue" class="stats-tag">
        总题量: {{ questionCount }}
      </a-tag>
    </template>
    
    <div class="chart-container">
      <ChartComponents height="310px" :option="chartOption" />
    </div>
    
    <div class="stats-summary">
      <div class="stat-item">
        <div class="stat-dot solved"></div>
        <div class="stat-info">
          <div class="stat-number">{{ questionSolveCount }}</div>
          <div class="stat-label">已通过</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-dot unsolved"></div>
        <div class="stat-info">
          <div class="stat-number">{{ questionUnSolveCount }}</div>
          <div class="stat-label">未通过</div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import useLoading from "@/hooks/loading";
import useChartOption from "@/hooks/chart-option";
import ChartComponents from "@/components/ChartComponents.vue";
import { onMounted, ref } from "vue";
import {Service} from "../../../../generated";

const { loading } = useLoading();
const questionUnSolveCount = ref(0);
const questionSolveCount = ref(0);
const questionCount = ref(0);

onMounted(async () => {
  try {
    const personalData = await Service.getPersonalDataUsingGet()
    questionCount.value = personalData.data?.questionCount ?? 0;
    questionSolveCount.value = personalData.data?.questionSolveCount ?? 0;
    questionUnSolveCount.value = questionCount.value - questionSolveCount.value;
  } catch (e) {
    //
  }
});

const { chartOption } = useChartOption((isDark) => {
  return {
    legend: {
      show: false,
    },
    tooltip: {
      show: true,
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e6eb',
      borderWidth: 1,
      textStyle: {
        color: '#1d2129'
      }
    },
    graphic: {
      elements: [
        {
          type: "text",
          left: "center",
          top: "40%",
          style: {
            text: "总题量",
            textAlign: "center",
            fill: isDark ? "#ffffffb3" : "#4E5969",
            fontSize: 14,
            fontWeight: 500,
          },
        },
        {
          type: "text",
          left: "center",
          top: "50%",
          style: {
            text: questionCount.value,
            textAlign: "center",
            fill: isDark ? "#ffffffb3" : "#1D2129",
            fontSize: 24,
            fontWeight: 700,
          },
        },
      ],
    },
    series: [
      {
        name: "做题情况",
        type: "pie",
        radius: ["50%", "70%"],
        center: ["50%", "50%"],
        label: {
          show: false,
        },
        itemStyle: {
          borderColor: isDark ? "#232324" : "#fff",
          borderWidth: 2,
          borderRadius: 4,
        },
        data: [
          {
            value: questionSolveCount.value,
            name: "已通过题目",
            itemStyle: {
              color: '#52c41a',
            },
          },
          {
            value: questionUnSolveCount.value,
            name: "未通过题目",
            itemStyle: {
              color: '#ff4d4f',
            },
          },
        ],
      },
    ],
  };
});
</script>

<style scoped>
.analysis-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
  overflow: hidden;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1d2129;
}

.card-icon {
  color: #165dff;
  font-size: 18px;
}

.stats-tag {
  font-weight: 500;
  border-radius: 6px;
  padding: 4px 8px;
}

.chart-container {
  margin: 16px 0;
  position: relative;
}

.stats-summary {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
  border-top: 1px solid #f2f3f5;
  margin-top: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.stat-dot.solved {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
}

.stat-dot.unsolved {
  background: linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%);
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-number {
  font-size: 18px;
  font-weight: 700;
  color: #1d2129;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: #86909c;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-summary {
    flex-direction: column;
    gap: 12px;
  }
  
  .stat-item {
    justify-content: center;
  }
  
  .stat-number {
    font-size: 16px;
  }
}
</style>
