<template>
  <el-card>
    <!-- 头部 -->
    <div slot="header">
      <div class="header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span>
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 内容区 -->
    <div>
      <!-- 折线图 -->
      <el-row :gutter="10">
        <el-col :span="12"><LineCharts/></el-col>
        <el-col :span="12"><LineCharts/></el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="tableArr" style="width: 100%; margin: 20px 0 10px;" border>
        <el-table-column type="index" label="排名" width="80"></el-table-column>
        <el-table-column prop="prop" label="搜索关键字" width="width"></el-table-column>
        <el-table-column prop="prop" label="用户数" sortable width="width"></el-table-column>
        <el-table-column prop="prop" label="周涨幅" sortable width="width"></el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        style="text-align: right;"
        layout="prev, pager, next"
        :total="1000">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import LineCharts from './LineCharts'
export default {
  name: 'Search',
  data() {
    return {
      tableArr: [{}]
    }
  },
  components: {LineCharts}
}
</script>

<style scoped>
  /* 头部 */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 36px;
  }
</style>