<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="150"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
      <el-table-column label="默认图片" width="150" align="center">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="80"></el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80"></el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{row}">
          <!-- isSale: 0代表下架，1代表上架 -->
          <el-button type="success" icon="el-icon-bottom" size="mini" v-if="row.isSale==0" @click="sale(row)"></el-button>
          <el-button type="info" icon="el-icon-top" size="mini" v-else @click="cancelSale(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateSku"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="text-align:center"
      @size-change="handleSizeChange"
      @current-change="getSkuList"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total">
    </el-pagination>
    <!-- 抽屉 drawer sync父子组件数据同步-->
    <el-drawer :visible.sync ="drawer" size="50%" :with-header="false">
      <!-- element-ui布局 24列-->
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag type="success" v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" style="margin-right:10px">{{attr.attrId}}-{{attr.valueId}}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <!-- 轮播图 height: 走马灯的高度-->
          <el-carousel v-show="skuInfo.skuImageList && skuInfo.skuImageList.length > 0" height="500px" style="border:1px solid #EBEEF5">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" style="height: 100%">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
  export default {
    name: 'Sku',
    data() {
      return {
        page: 1,  //当前页
        limit: 10,  //当前页展示多少条数据
        total: 0,  //存储总共多少条数据
        records: [],  //存储sku列表数据
        skuInfo: {},  //存储sku详情数据
        drawer: false  //控制抽屉显示与隐藏
      }
    },
    mounted() {
      this.getSkuList()
    },
    methods: {
      //获取sku列表数据
      async getSkuList(pager = 1) {
        this.page = pager
        const {page, limit} = this
        let result = await this.$API.sku.reqSkuList(page, limit)
        if(result.code == 200) {
          //请求成功，将total和records存储起来，用于展示页面
          this.total = result.data.total
          this.records = result.data.records
        }
      },
      //设置当前页展示的条数的回调
      handleSizeChange(limit) {
        this.limit = limit
        this.getSkuList()
      },
      //上架
      async sale(row) {
        let result = await this.$API.sku.reqSale(row.id)
        if(result.code == 200) {
          row.isSale = 1  
          this.$message({type: 'success', message: '上架成功'})
        }
      },
      //下架
      async cancelSale(row) {
        let result = await this.$API.sku.reqCancelSale(row.id)
        if(result.code == 200) {
          row.isSale = 0
          this.$message({type: 'success', message: '下架成功'})
        }
      },
      //修改
      updateSku() {
        this.$message('正在开发中...')
      },
      //获取sku详情数据
      async getSkuInfo(sku) {
        //清空数据
        this.skuInfo = {}
        //显示抽屉
        this.drawer = true
        //发请求，获取sku详情数据
        let result = await this.$API.sku.reqGetSkuById(sku.id)
        if(result.code == 200) {
          this.skuInfo = result.data
        }
      }
    },
  }
</script>

<style scoped>
  .el-row {
    margin: 10px 10px;
  }
  .el-row .el-col-5 {
    text-align: right;
    font-size: 20px;
    font-weight: bold;
    margin: 6px 20px 0 0;
  }
  .el-row .el-col-16 {
    line-height: 2;
  }
  /* 父组件使用了scoped，还想影响子组件的样式，可以使用深度选择器 */
  >>> .el-carousel__button {
    width: 20px;
    height: 20px;
    background-color: pink;
    border-radius: 50%;
  }
  /* 抽屉分辨率设置 */
  >>> .rtl {
    overflow: auto;
  }
</style>