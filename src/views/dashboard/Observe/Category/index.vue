<template>
  <el-card>
    <!-- 头部 -->
    <div slot="header">
      <div class="header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="radio" size="medium">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <!-- 中间部分 -->
    <div>
      <!-- 饼图 -->
      <div class="pieChart" ref="pieChart"></div>
    </div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'Category',
  data() {
    return {
      radio: '全部渠道',   //控制按钮的单选组合
    }
  },
  mounted() {
    //初始化echarts实例
    let pieChart = echarts.init(this.$refs.pieChart)
    //饼图配置项
    pieChart.setOption({
      title: {
        text: '视频',
        subtext: 1048,
        left: 'center',
        top: 'middle'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          data: [
            { value: 1048, name: '视频' },
            { value: 735, name: '游戏' },
            { value: 580, name: '直播' },
            { value: 484, name: '购物' },
            { value: 300, name: '篮球' }
          ]
        }
      ]
    })
    //echarts鼠标事件
    pieChart.on('mouseover', (params) => {
      //事件回调，重新设置标题
      pieChart.setOption({
        title: {
          text: params.data.name,
          subtext: params.data.value
        }
      })
    })
  },
}
</script>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 36px;
  }
  .pieChart {
    width: 100%;
    height: 300px;
  }
</style>