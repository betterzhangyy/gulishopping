<template>
  <div>
    <!-- 需要响应式布局 gutter: 栅格间隔 -->
    <el-row :gutter="10">
      <el-col :span="6">
        <Detail title="总销售额" count="￥ 126560">
          <template slot="chart">
            <div style="padding-top: 10px; font-size: 14px;">
                <span>周同比 56.67% <svg t="1661673123613" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1215" width="16" height="16"><path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="1216"></path></svg></span>
                &nbsp;&nbsp;
                <span>同日比 19.16% <svg t="1661673379262" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2281" width="16" height="16"><path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="2282"></path></svg></span>
            </div>
          </template>
          <template slot="footer">
            <span>日销售额 ￥12423</span>
          </template>
        </Detail>
      </el-col>
      <el-col :span="6">
        <Detail title="访问量" count="88460">
          <!-- 使用折线图组件 -->
          <template slot="chart">
            <LineChart/>
          </template>
          <template slot="footer">
            <span>日访问量 1234</span>
          </template>
        </Detail>
      </el-col>
      <el-col :span="6">
        <Detail title="支付笔数" count="88460">
          <!-- 使用柱状图组件 -->
          <template slot="chart">
            <BarChart/>
          </template>
          <template slot="footer">
            <span>转化率 56%</span>
          </template>
        </Detail>
      </el-col>
      <el-col :span="6">
        <Detail title="运营活动效果" count="78%">
           <!-- 使用进度条组件 -->
          <template slot="chart">
            <ProgressChart/>
          </template>
          <template slot="footer">
            <span>周同比 12% <svg t="1661673123613" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1215" width="16" height="16"><path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="1216"></path></svg></span>
            &nbsp;&nbsp;
            <span>同日比 11% <svg t="1661673379262" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2281" width="16" height="16"><path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="2282"></path></svg></span>
          </template>
        </Detail>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './Detail'
import LineChart from './LineChart'
import BarChart from './BarChart'
import ProgressChart from './ProgressChart'
export default {
  name: 'Card',
  components: {Detail, LineChart, BarChart, ProgressChart}
}
</script>

<style>
  svg {
    padding-top: 5px;
  }
</style>