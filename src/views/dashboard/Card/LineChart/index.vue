<template>
  <div class="lineChart" ref="lineChart"></div>
</template>

<script>
//引入echarts
import echarts from 'echarts'
export default {
  name: 'LineChart',
  mounted() {
    //初始化echarts实例
    let lineChart = echarts.init(this.$refs.lineChart)
    //配置echarts配置项
    lineChart.setOption({
      //x轴
      xAxis: {
        //x轴是类目轴
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
          type: 'line',
          data: [82, 11, 90, 44, 129, 88, 132, 23, 44, 55],
          //是否平滑曲线显示
          smooth: true,
          //折线拐点标志的样式
          itemStyle: {
            //0 时不绘制该图形
            opacity: 0
          },
          //线条的样式
          lineStyle: {
            color: 'purple'
          },
          //区域填充样式
          areaStyle: {
            //设置渐变色
            color: {
              // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，
              //如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0, 
                  color: 'purple' // 0% 处的颜色
                }, 
                {
                  offset: 1, 
                  color: 'white' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
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
  .lineChart {
    width: 100%;
    height: 100%;
  }
</style>