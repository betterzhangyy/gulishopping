<template>
  <div class="barChart" ref="barChart"></div>
</template>

<script>
//引入echarts
import echarts from 'echarts'
export default {
  name: 'BarChart',
  mounted() {
    //初始化echarts实例
    let barChart = echarts.init(this.$refs.barChart)
    //配置echarts配置项
    barChart.setOption({
      //x轴
      xAxis: {
        //均分
        type: 'category',
        //是否显示 x 轴
        show: false  
      },
      //y轴
      yAxis: {
        //是否显示y轴
        show: false
      },
      //系列
      series: [
        {
          type: 'bar',
          data: [82, 45, 90, 44, 55, 88, 60, 45, 30, 55, 60, 80],
          color: 'cyan'
        }
      ],
      tooltip: {},
      //图表位置
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }
    })
  },
}
</script>

<style>
  .barChart {
    width: 100%;
    height: 100%;
  }
</style>