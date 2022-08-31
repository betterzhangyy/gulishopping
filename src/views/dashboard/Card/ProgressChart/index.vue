<template>
  <div class="progressChart" ref="progressChart"></div>
</template>

<script>
//引入echarts
import echarts from 'echarts'
export default {
  name: 'ProgressChart',
  mounted() {
    //初始化echarts实例
    let progressChart = echarts.init(this.$refs.progressChart)
    //配置echarts配置项
    progressChart.setOption({
      //x轴
      xAxis: {
        //是否显示 x 轴
        show: false,
        //坐标轴刻度最小值
        min: 0,
        //坐标轴刻度最大值
        max: 100 
      },
      //y轴
      yAxis: {
        //是否显示y轴
        show: false,
        //均分
        type: 'category',
      },
      //系列
      series: [
        {
          type: 'bar',
          data: [78],
          color: 'yellowgreen',
          //柱条宽度
          barWidth: 15,
          //显示背景
          showBackground: true,
          //背景样式的设置
          backgroundStyle: {
            color: '#eee'
          },
          //文本标签
          label: {
            //是否显示标签
            show: true,
            //标签内容格式器，支持字符串和回调函数
            formatter: '|',
            //标签位置
            position: 'right'
          }
        }
      ],
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
  .progressChart {
    width: 100%;
    height: 100%;
  }
</style>