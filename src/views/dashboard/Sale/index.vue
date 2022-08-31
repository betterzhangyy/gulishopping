<template>
  <el-card>
    <!-- 头部 -->
    <div slot="header" class="header">
      <!--头部左侧标签页  @tab-click="handleClick" -->
      <el-tabs v-model="activeName" class="tabs">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
         <el-date-picker
          v-model="date"
          class="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
          >
        </el-date-picker>
      </div>
    </div>
    <!-- 内容区 -->
    <el-row :gutter="10">
      <!-- 左侧 柱状图 -->
      <el-col :span="18">
        <div class="left-content" ref="chart"></div>
      </el-col>
      <!-- 右侧 排名展示 -->
      <el-col :span="6" class="right-content">
        <h3 class="title">门店{{title}}排名</h3>
        <ul>
          <li>
            <span class="activeIndex">1</span>
            <span>肯德基</span>
            <span class="rightValue">323,234</span>
          </li>
          <li>
            <span class="activeIndex">2</span>
            <span>麦当劳</span>
            <span class="rightValue">299,132</span>
          </li>
          <li>
            <span class="activeIndex">3</span>
            <span>汉堡王</span>
            <span class="rightValue">283,998</span>
          </li>
          <li>
            <span class="index">4</span>
            <span>德克士</span>
            <span class="rightValue">266,223</span>
          </li>
          <li>
            <span class="index">5</span>
            <span>华莱士</span>
            <span class="rightValue">223,445</span>
          </li>
          <li>
            <span class="index">6</span>
            <span>塔斯汀</span>
            <span class="rightValue">219,663</span>
          </li>
          <li>
            <span class="index">7</span>
            <span>皮克斯</span>
            <span class="rightValue">200,997</span>
          </li>
        </ul>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import echarts from 'echarts'
import dayjs from 'dayjs'
import {mapState} from 'vuex'
export default {
  name: 'Sale',
  data() {
    return {
      activeName: 'sale',  //默认显示销售额
      myChart: null,  //为了可以使watch中拿到echarts实例
      date: [],   //收集日历日期
    }
  },
  computed: {
    //计算出内容区右侧标题的属性
    title() {
      return this.activeName == 'sale' ? '销售额' : '访问量'
    },
    //读取vuex中的state的数据
    ...mapState({
      list: state => state.home.list || {}
    })
  },
  watch: {
    //监视tabs切换，修改柱状图的内容，重新渲染图表
    title() {
      this.myChart.setOption({
        title: {
          text: this.title + '趋势'
        },
        //获取服务器的数据重新渲染图表
        xAxis: {
          data: this.activeName == 'sale' ? this.list.orderFullYearAxis : this.list.userFullYearAxis
        },
        series: [
          {
            data: this.activeName == 'sale' ? this.list.orderFullYear : this.list.userFullYear,
            color: this.activeName == 'sale' ? 'skyblue' : 'red'
          }
        ]
      })
    },
    list() {
      //服务器数据回来之后，再渲染图表
      this.getChart()
    }
  },
  methods: {
    //今日
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    //本周
    setWeek() {
      //传入 number 从0(星期天)到6(星期六)
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    //本月
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    //本年
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    //创建柱状图
    getChart() {
      this.myChart = echarts.init(this.$refs.chart)
      this.myChart.setOption({
        title: {
          text: this.title + '趋势'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            //默认展示销售额
            data: this.list.orderFullYearAxis || [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.list.orderFullYear || [],
            color: 'skyblue'
          }
        ]
      })
    }
  },
}
</script>

<style scoped>
  >>>.el-card__header {
    border-bottom: none;
  }
  >>>.el-tabs__nav-wrap::after {
    height: 1px;
  }
  /* 头部样式 */
  .header {
    position: relative;
    display: flex;
    justify-content: space-between;
  }
  .tabs {
    /* 让标签页占满一行，底部横线 */
    width: 100%;
  }
  .right {
    position: absolute;
    right: 0;
    font-size: 14px;
  }
  .right span {
    margin: 0 10px;
  }
  .date {
    width: 220px;
    margin: 0 20px;
  }

  /* 内容区 */
  .left-content {
    width: 100%;
    height: 300px;
  }
  .right-content {
    height: 300px;
  }
  .title {
    margin: 0;
  }
  ul{
    padding: 0;
    margin: 0;
    height: 280px;
    padding-top: 30px;
  }
  ul li{
    list-style: none;
    height: 14%;
  }
  .activeIndex {
    /* 让span变成行内块元素 */
    float: left; 
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: black;
    color: white; 
    text-align: center;
    margin-right: 30px;
  }
  .index {
    margin-left: 5px;
    margin-right: 35px;
  }
  .rightValue {
    float: right;
    margin-right: 10px;
  }
  
</style>