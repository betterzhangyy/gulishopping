<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <span class="left-header">搜索用户数</span>
      <i class="iconfont icon-info"></i>
    </div>
    <!-- 中间部分 -->
    <div class="main">
      <span class="left-main">12321</span>
      <span>17.1</span>
      <svg t="1661673123613" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1215" width="16" height="16"><path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="1216"></path></svg>
      <svg t="1661673379262" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2281" width="16" height="16"><path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="2282"></path></svg>
    </div>
    <!-- 底部：折线图 -->
    <div class="lineCharts" ref="lineCharts"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'LineCharts',
  mounted() {
    //获取echarts实例
    const myCharts = echarts.init(this.$refs.lineCharts)
    myCharts.setOption({
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
            color: 'blue'
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
                  color: 'blue' // 0% 处的颜色
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
  }
}
</script>

<style scoped>
  /* 头部 */
  .header {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #aaa1a1;
  }
  .left-header {
    margin-right: 10px;
  }
  /* 中间 */
  .main {
    margin: 10px 0;
  }
  .left-main {
    margin-right: 20px;
  }
  /* 底部 */
  .lineCharts {
    width: 100%;
    height: 50px;
  }
</style>