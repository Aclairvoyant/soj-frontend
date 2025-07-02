<template>
  <a-card class="content-chart-card" :bordered="false">
    <template #title>
      <div class="card-title">
        <icon-line-chart class="card-icon" />
        <span>学习趋势</span>
      </div>
    </template>
    <template #extra>
      <a-tag color="blue" class="trend-tag">
        本周数据
      </a-tag>
    </template>
    
    <div class="chart-placeholder">
      <div class="placeholder-content">
        <icon-bar-chart class="placeholder-icon" />
        <div class="placeholder-text">图表功能开发中</div>
        <a-button type="primary" size="small" class="placeholder-btn">
          <template #icon>
            <icon-plus />
          </template>
          敬请期待
        </a-button>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useLoading from "@/hooks/loading";
import useChartOption from "@/hooks/chart-option";
import ChartComponents from "@/components/ChartComponents.vue";
import {ToolTipFormatterParams} from "@/types/echarts";
import {AnyObject} from "@/types/global";

function graphicFactory(side: AnyObject) {
  return {
    type: "text",
    bottom: "8",
    ...side,
    style: {
      text: "",
      textAlign: "center",
      fill: "#4E5969",
      fontSize: 12,
    },
  };
}

const { loading, setLoading } = useLoading(true);
const xAxis = ref<string[]>([]);
const chartsData = ref<number[]>([]);
const graphicElements = ref([
  graphicFactory({ left: "2.6%" }),
  graphicFactory({ right: 0 }),
]);

const { chartOption } = useChartOption(() => {
  return {
    grid: {
      left: "2.6%",
      right: "0",
      top: "10",
      bottom: "30",
    },
    xAxis: {
      type: "category",
      offset: 2,
      data: xAxis.value,
      boundaryGap: false,
      axisLabel: {
        color: "#4E5969",
        formatter(value: number, idx: number) {
          if (idx === 0) return "";
          if (idx === xAxis.value.length - 1) return "";
          return `${value}`;
        },
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        interval: (idx: number) => {
          if (idx === 0) return false;
          if (idx === xAxis.value.length - 1) return false;
          return true;
        },
        lineStyle: {
          color: "#E5E8EF",
        },
      },
      axisPointer: {
        show: true,
        lineStyle: {
          color: "#23ADFF",
          width: 2,
        },
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false,
      },
      axisLabel: {
        formatter(value: any, idx: number) {
          if (idx === 0) return value;
          return `${value}k`;
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: "#E5E8EF",
        },
      },
    },
    tooltip: {
      trigger: "axis",
      formatter(params) {
        const [firstElement] = params as ToolTipFormatterParams[];
        return `<div>
            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
            <div class="content-panel"><span>总内容量</span><span class="tooltip-value">${(
              Number(firstElement.value) * 10000
            ).toLocaleString()}</span></div>
          </div>`;
      },
      className: "echarts-tooltip-diy",
    },
    graphic: {
      elements: graphicElements.value,
    },
    series: [
      {
        data: chartsData.value,
        type: "line",
        smooth: true,
        symbolSize: 12,
        emphasis: {
          focus: "series",
          itemStyle: {
            borderWidth: 2,
          },
        },
        lineStyle: {
          width: 3,
          color: '#165dff',
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: '#e6f4ff',
        },
      },
    ],
  };
});

const fetchData = async () => {
  setLoading(true);
  try {
    // 图表数据获取逻辑
  } catch (err) {
    // 错误处理
  } finally {
    setLoading(false);
  }
};

fetchData();
</script>

<style scoped>
.content-chart-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
  overflow: hidden;
  min-height: 400px;
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

.trend-tag {
  font-weight: 500;
  border-radius: 6px;
  padding: 4px 8px;
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 8px;
  margin: 16px 0;
  border: 2px dashed #e2e8f0;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.placeholder-icon {
  font-size: 48px;
  color: #cbd5e1;
}

.placeholder-text {
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
}

.placeholder-btn {
  border-radius: 6px;
  font-weight: 500;
  background: linear-gradient(135deg, #165dff 0%, #0e42d2 100%);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.3);
}

.placeholder-btn:hover {
  background: linear-gradient(135deg, #0e42d2 0%, #0a2f9e 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chart-placeholder {
    height: 250px;
  }
  
  .placeholder-icon {
    font-size: 36px;
  }
  
  .placeholder-text {
    font-size: 14px;
  }
}
</style>
