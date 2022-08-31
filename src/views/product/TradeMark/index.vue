<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0" @click="showAddTradeMarkDialog">添加</el-button>
    <!-- 表格 数据是一列一列进行展示的
    当el-table元素中注入data对象数组后，在el-table-column中用prop属性来对应对象中的键名即可填入数据
      el-table 
        data: 用于显示的数据， array
        border: 是否带纵向边框，给表格添加边框
      el-table-column 表格多少列
        label: 显示的标题
        width: 列的宽度
        align: 对齐方式
        type: 对应列的类型  index显示该行的索引（从1开始计算） 
        prop: 对应列内容的字段
     -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" prop="prop" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column label="品牌LOGO" width="width">
        <!--作用域插槽 Scoped slot可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据 -->
        <template slot-scope="{row}">
          <img :src="row.logoUrl" style="width: 100px; height: 100px">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <!-- 作用域插槽 解构出row-->
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="showUpdateTradeMarkDialog(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器
      el-pagination
        current-page: 当前页码
        page-size: 每页展示条数
        page-sizes: 设置每页展示条数
        total: 总数
        pager-count: 页码按钮的数量  如果是7，连续页码数就是5
        layout: 组件布局，子组件名用逗号分隔
        @size-change="handleSizeChange"  每页展示的条数发生改变时触发，会注入pageSize
        @current-change="handleCurrentChange"  当前页改变时触发，会注入currentPage 
    -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      :total="total"
      :pager-count="7"
      @current-change="getTradeMarkList" 
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper, ->, sizes, total"
    >
    </el-pagination>

    <!-- 对话框 
      el-dialog
        visible: 对话框显示与隐藏
    -->
    <el-dialog :title="this.tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form表单  
        mode：表单数据对象
        rules: 表单验证规则
          Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
          并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
         rules prop ref
      -->
      <el-form :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 图片上传 
            这里收集数据：不能使用v-model，因为不是表单元素
            action:设置图片上传的地址
            show-file-list:	是否显示已上传文件列表
            :on-success:可以检测到图片上传成功，当图片上传成功，会执行一次
            :before-upload：可以在上传图片之前，会执行一次
          -->
          <el-upload
            class="avatar-uploader"
            action="dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <!-- 图片上传成功之后，服务器会返回图片在服务器上存储的地址，给前端显示图片 -->
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>  
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "TradeMark",
    data() {
      //自定义校验规则
      var validateTmName = (rule, value, callback) => {
        //value: 获取输入的值
        //callback: 放行
        if(value.length < 2 || value.length > 10) {
          //校验未通过
          callback(new Error('长度在 2 到 10 个字符'))
        } else {
          //校验通过
          callback()
        }
      }
      return {
        page: 1,  //当前第几页
        limit: 3,  //每页展示多少条数据
        total: 0,  //总共多少条数据
        list: [],   //存储品牌列表数据
        dialogFormVisible: false,   //对话框的显示与隐藏
        tmForm: {  //表单对象
          tmName: '',   //品牌名称
          logoUrl: '',  //图片的url
        },
        //定义表单验证规则
        /**
         * required: 必填
         * message: 提示信息
         * trigger: 触发事件 blur|change
         * min: 最小长度 
         * max: 最大长度
         */
        rules: {
          //品牌名称
          tmName: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            //自定义验证规则
            { validator: validateTmName, trigger: 'change' }
            // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
          ],
          //品牌图片，upload不是表单元素，没有change|blur事件
          logoUrl: [
            { required: true, message: '请选择品牌图片'}
          ]
        }
      }
    },
    mounted() {
      this.getTradeMarkList()
    },
    methods: {
      //获取品牌列表
      async getTradeMarkList(currentPage  = 1) {
        this.page = currentPage 
        const {page, limit} = this
        //发请求，获取品牌管理列表数据
        let result = await this.$API.tradeMark.reqGetTradeMarkList(page, limit)
        if(result.code == 200) {
          //将服务器返回的数据存储到data中，用于动态展示页面
          this.total = result.data.total
          this.list = result.data.records
        } else {
          alert(result.message)
        }
      },
      //当分页器某一页需要展示数据条数发生变化的时候会触发
      handleSizeChange(pageSize) {
        this.limit = pageSize
        this.getTradeMarkList()
      },
      //打开添加品牌对话框
      showAddTradeMarkDialog() {
        //显示对话框
        this.dialogFormVisible = true
        //每次打开对话框都要清空上次遗留的数据
        this.tmForm = {tmName: '', logoUrl: ''}
      },
      //打开修改品牌对话框
      showUpdateTradeMarkDialog(row) {
        //显示对话框
        this.dialogFormVisible = true
        //展示这条品牌的数据
        //利用扩展运算符的浅拷贝
        this.tmForm = {...row}
      },
      //图片上传成功的回调
      handleAvatarSuccess(res, file) {
        //res: 上传图片到服务器dev-api/admin/product/fileUpload，成功之后，服务器返回的数据
        //file: 图片的详细数据，包括服务器返回的数据和图片的一些设置
        //收集图片上传成功之后，服务器上的url，添加或是修改，需要带的品牌的logo图片地址（已经成功上传服务器，服务器返回的地址）
        this.tmForm.logoUrl = res.data
      },
      //文件上传之前，校验图片的格式和大小
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //添加|修改品牌信息
      addOrUpdateTradeMark() {
        //表单验证
        //对整个表单进行校验的方法，参数为一个回调函数。
        //该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。
        //若不传入回调函数，则会返回一个 promise
        this.$refs.ruleForm.validate(async (success) => {
          //表单验证通过
          if(success) {
            //关闭对话框
            this.dialogFormVisible = false
            let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)
            if(result.code == 200) {
              //使用element-ui消息提示，Element 为 Vue.prototype 添加了全局方法 $message
              //type: 主题
              //message: 消息文字
              this.$message({
                type: 'success', 
                message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
              })
              //添加，page=1，修改，page为当前页
              this.getTradeMarkList(this.tmForm.id ? this.page : 1)
            } 
          } else{
            //验证失败
            console.log('error submit!!')
            return false
          }
        })
      },
      //删除品牌信息
      deleteTradeMark(row) {
        this.$confirm(`确定删除${row.tmName}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          //当用户点击确定时会触发 
          //向服务器发请求，删除品牌
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id)
          //删除成功
          if(result.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            //再次获取品牌列表数据，刷新列表数据
            //如果当前列表只有数据>1，停留在当页，如果列表数据<=1，到前一页
            this.getTradeMarkList(this.list.length > 1 ? this.page : this.page - 1)
          }
        }).catch(() => {
          //当用户点击取消时会触发
          this.$message({
            type: 'info',
            message: '已取消删除'
          })         
        })
      }
    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
 