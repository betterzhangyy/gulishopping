<template>
  <!-- 卡片 -->
  <el-card>
    <div class="card-header">{{title}}<i class="iconfont icon-info"></i></div>
    <div class="card-content">{{count}}</div>
    <div class="card-chart">
      <!-- 具名插槽 -->
      <slot name="chart"></slot>
    </div>
    <div class="card-footer">
      <!-- 具名插槽 -->
      <slot name="footer"></slot>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Detail',
  props: ['title', 'count']
}
</script>

<style>
  .card-header {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #cbc4c4;
  }
  .card-content {
    font-size: 20px;
  }
  .card-chart {
    padding: 10px 0;
    height: 55px;
  }
  .card-footer {
    border-top: 1px solid #eee;
    padding-top: 10px;
    font-size: 14px;
    height: 30px;
  }
</style>