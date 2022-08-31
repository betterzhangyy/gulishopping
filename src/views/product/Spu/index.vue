<template>
  <div>
    <el-card style="margin: 20px 0">
      <!-- 使用全局组件CategorySelect -->
      <!-- 自定义事件，需要子组件传递三级标题id，三级标题的可操作性性 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="scene!=0" />
    </el-card>
    <el-card>
      <!-- 根据scene的值进行切换 -->
      <div v-show="scene == 0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <!-- 列表数据表格 -->
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{row}">
              <!-- 使用封装的带有提示的el-button，HintButton可以使用hint-button-->
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="getSkuList(row)"></hint-button>
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`你确定删除${row.spuName}吗？`" @onConfirm="deleteSpu(row)">
                <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
         <!-- 分页器 -->
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          :total="total">
        </el-pagination>
      </div>
      <!-- ref: 操作子组件中的属性和方法 -->
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"/>
      <SkuForm v-show="scene == 2" ref="sku" @changeScenes="changeScenes"/>
    </el-card>
    <!-- 对话框 -->
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="handleClose">
      <!-- loading效果 v-loading -->
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
        <el-table-column prop="price" label="价格" width="width"></el-table-column>
        <el-table-column prop="weight" label="重量" width="width"></el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" style="width:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  //引入子组件
  import SpuForm from './SpuForm'
  import SkuForm from './SkuForm'
  export default {
    name: 'Spu',
    components: {SpuForm, SkuForm},
    data() {
      return {
        category1Id: '', //一级标题id
        category2Id: '', //二级标题id
        category3Id: '', //三级标题id
        page: 1, //当前第几页
        limit: 3,  //每页展示几条数据
        total: 0,  //存储服务器返回的列表总数
        records: [],  //存储spu列表数据
        scene: 0,  //0表示展示列表数据，1表示展示添加|修改SPU（SpuForm组件），2表示展示添加SKU（SkuForm组件）
        dialogTableVisible: false,  //控制对话框的显示与隐藏
        spu: {},    //存储spu
        skuList: [],   //存储spu的所有sku列表数据
        loading: true  //控制loading效果是否显示与隐藏
      }
    },
    methods: {
      //自定义事件，获取三级标题的id
      //categoryId: 一、二、三级标题的id，level：区别三级标题id
      getCategoryId({categoryId, level}) {
        if(level == 1) {
          this.category1Id = categoryId
          //清空二、三级标题id
          this.category2Id = ''
          this.category3Id = ''
        } else if(level == 2) {
          this.category2Id = categoryId
          //清空三级标题id
          this.category3Id = ''
        } else {
          this.category3Id = categoryId
          //已经存在三级标题id，发请求获取SPU列表数据
          this.getSpuList()
        }
      },
      //获取SPU列表数据
      async getSpuList(pager = 1) {
        //改变当前页，会注入page，如果没有page，就使用默认值1
        this.page = pager
        //解构出参数
        const {page, limit, category3Id} = this
        let result = await this.$API.spu.reqGetSpuList(page, limit, category3Id)
        if(result.code == 200) {
          //成功，存储总数和列表数据，用户页面展示
          this.total = result.data.total
          this.records = result.data.records
        }
      },
      //修改当前页展示的条数的回调
      handleSizeChange(limit) {
        this.limit = limit
        this.getSpuList()
      },
      //添加SPU的事件回调
      addSpu() {
        //切换场景，展示添加或修改Spu的组件
        this.scene = 1
        //点击添加，通知子组件发请求
        this.$refs.spu.addSpuData(this.category3Id)
      },
      //修改SPU的事件回调
      updateSpu(row) {
        //切换场景，展示添加或修改Spu的组件
        this.scene = 1
        //点击修改，父组件调用子组件中的方法（切换场景，使用v-show，子组件和父组件一开始就已经挂载完毕，不能在子组件mounted中调用）
        this.$refs.spu.initSpuData(row)
      },
      //SpuForm组件中，自定义事件，更换结构（场景）
      changeScene({scene, flag}) {
        this.scene = scene
        //切换场景之后，需要重新获取最新的spu列表数据
        //添加，留在第一页，修改，留在当前页
        if(flag == '修改') {
          this.getSpuList(this.page)
        } else {
          this.getSpuList()
        }
      },
      //删除spu的回调
      async deleteSpu(row) {
        let result = await this.$API.spu.reqDeleteSpu(row.id)
        if(result.code == 200) {
          //提示信息
          this.$message({type: 'success', message: '删除成功'})
          //重新刷新列表数据 表格大于1条，就留在当前页，如果只有1条，删除掉，就要回到上一页
          this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
        }
      },
      //添加SKU的事件回调
      addSku(row) {
        //切换场景为2
        this.scene = 2
        //调用子组件的方法，让他发请求
        this.$refs.sku.getSkuData(row, this.category1Id, this.category2Id)
      },
      //自定义事件，SkuForm触发，切换场景
      changeScenes(scene) {
        this.scene = scene
      },
      //获取SPU的所有SKU列表数据
      async getSkuList(spu) {
        //展示对话框
        this.dialogTableVisible = true
        //存储spu
        this.spu = spu
        //发请求，获取SKU列表数据
        let result = await this.$API.spu.reqGetSkuList(spu.id)
        if(result.code == 200) {
          this.skuList = result.data
          //获取到服务器的数据之后，需要关闭loading效果
          this.loading = false
        }
      },
      //关闭对话框的回调
      handleClose(done) {
        //重置loading数据，下次可以再次使用loading效果
        this.loading = true
        //出现数据回显，需要清空数据
        this.skuList = []
        //关闭对话框
        done()
      }
    },
  }
</script>

<style>

</style>