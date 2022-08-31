<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option :label="tm.tmName" :value="tm.id" v-for="tm in tradeMarkList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <!-- 文本域：指定input中type类型，rows变高 -->
        <el-input type="textarea" rows="4" placeholder="SPU描述" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 使用照片墙
          list-type: 文件列表的类型
          file-list: 上传的文件列表，数组类型，里面要有name和url
          on-preview: 预览图片
          on-remove: 文件列表移除文件时的钩子
          on-success: 文件上传成功的钩子
         -->
        <el-upload
          action="dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectedSaleAttrArr.length}未选择`" v-model="saleAttrIdAndName">
          <el-option :label="unSelectedSaleAttr.name" :value="`${unSelectedSaleAttr.id}:${unSelectedSaleAttr.name}`" v-for="unSelectedSaleAttr in unSelectedSaleAttrArr" :key="unSelectedSaleAttr.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!saleAttrIdAndName" @click="addSaleAttr">添加销售属性</el-button>
        <!-- 表格展示的是spu中自己的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150">
          </el-table-column>
          <el-table-column label="属性值名称列表" width="width">
            <template slot-scope="{row}">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
               >
                {{tag.saleAttrValueName}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)" 
                @keyup.enter.native="handleInputConfirm(row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancelSpu">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'SpuForm',
    data() {
      return {
        dialogImageUrl: '',  //图片的地址
        dialogVisible: false,  //控制对话框的显示与隐藏
        //添加|修改保存时，需要给服务器的参数
        spu: {
          category3Id: '',  //三级标题id
          spuName: '',  //spu名称
          tmId: '',      //品牌id
          description: '', //spu描述
          spuImageList: [],   //spu图片列表
          spuSaleAttrList: []  //spu平台属性列表
        },
        tradeMarkList: [],  //存储品牌信息
        spuImageList: [],  //存储某一个spu图片信息
        saleAttrList: [],  //存储平台中所有的销售属性
        saleAttrIdAndName: ''  //未选择的销售属性的id和name
      }
    },
    computed: {
      //计算未选择的销售属性
      unSelectedSaleAttrArr() {
        //全部的销售属性数组 saleAttrList --> 颜色、尺码、版本
        //spu已有的销售属性数组 spu.spuSaleAttrList --> 颜色、版本
        return this.saleAttrList.filter(item => {
          //every返回布尔值
          return this.spu.spuSaleAttrList.every(item1 => {
            return item.name !== item1.saleAttrName  //未选择的销售属性
          })
        })
      }
    },
    methods: {
      //移除图片时触发的回调  file移除图片的信息  fileList照片墙剩余图片的列表
      handleRemove(file, fileList) {
        //需要收集图片数据
        this.spuImageList = fileList
      },
      //图片预览时触发  file当前预览的图片信息
      handlePictureCardPreview(file) {
        //将图片的地址赋值给对话框里面的img的地址，给对话框显示图片
        this.dialogImageUrl = file.url
        //显示对话框
        this.dialogVisible = true
      },
      //图片上传成功时触发 response服务器返回的数据  file当前图片的信息 fileList照片墙剩余图片的列表
      handleSuccess(response, file, fileList) {
        //收集图片的数据
        this.spuImageList = fileList
      },
      //初始化某一个SPU数据
      async initSpuData(spu) {
        //获取某一个SPU信息
        let spuResult = await this.$API.spu.reqGetSpuById(spu.id)
        if(spuResult.code == 200) {
          this.spu = spuResult.data
        }
        //获取品牌数据
        let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
        if(tradeMarkResult.code == 200) {
          this.tradeMarkList = tradeMarkResult.data
        }
        //获取SPU图片数据
        let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
        if(spuImageResult.code == 200) {
          //照片墙展示的数组，需要有name和url字段，重新给服务器返回的数组添加这两个字段，用于展示照片墙
          let listArr = spuImageResult.data
          listArr.forEach(item => {
            item.name = item.imgName
            item.url = item.imgUrl
          })
          this.spuImageList = listArr
        }
        //获取平台中全部的销售属性
        let saleAttrResult = await this.$API.spu.reqSaleAttrList()
        if(saleAttrResult.code == 200) {
          this.saleAttrList = saleAttrResult.data
        }
      },
      //添加销售属性的回调
      addSaleAttr() {
        //整理参数，表格展示的是spu.spuSaleAttrList，需要添加的对象的数据是：baseSaleAttrId saleAttrName spuSaleAttrValueList
        const [baseSaleAttrId, saleAttrName] = this.saleAttrIdAndName.split(':')
        const saleAttr = {baseSaleAttrId, saleAttrName, spuSaleAttrValueList: []}
        //点击添加，向数组spuSaleAttrList中push一条数据
        this.spu.spuSaleAttrList.push(saleAttr)
        //select框要清空数据
        this.saleAttrIdAndName = ''
      },
      //点击添加的回调，添加属性值，将button切换为input
      showInput(row) {
        //给这一行的数据添加一个响应式数据inputVisible，控制input和button的切换
        this.$set(row, 'inputVisible', true)
        //添加一个响应式数据inputValue，用于收集input的数据
        this.$set(row, 'inputValue', '')
      },
      //input失去焦点的事件的回调，将input切换为button
      handleInputConfirm(row) {
        //整理参数，解构出需要的属性
        const {baseSaleAttrId, inputValue} = row
        //用户输入的属性值不能为空
        if(inputValue.trim() == '') {
          this.$message('属性值不能为空！')
          return
        }
        //用户输入的属性值不能和数组中存在的重复 some只要有一个满足条件就返回true，every要所有满足条件才返回true
        let isRepeat = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === inputValue)
        if(isRepeat) return
        //往属性值列表数组spuSaleAttrValueList中push要添加的属性，需要一个对象，baseSaleAttrId、saleAttrValueName
        row.spuSaleAttrValueList.push({baseSaleAttrId, saleAttrValueName: inputValue})
        //将input切换为button
        row.inputVisible = false
      },
      //添加|修改SPU
      async addOrUpdateSpu() {
        //整理参数
        //map: 适合遍历数组，改变数组中的每一项，返回一个新数组
        this.spu.spuImageList = this.spuImageList.map(item => {
          //添加或修改，整理需要带给服务器图片的数据
          return {
            imgName : item.name,
            imgUrl: (item.response && item.response.data) || item.url
          }
        })
        //向服务器发请求，保存数据
        let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
        if(result.code == 200) {
          //提示消息
          this.$message({type: 'success', message: '保存成功'})
          //通知父组件修改场景为0，需要区分是添加时的保存，还是修改时的保存，刷新列表需要区分是留在第一页还是当前页
          this.$emit('changeScene', {scene: 0, flag: this.spu.id ? '修改' : '添加'})
        }  
        //清空数据
        Object.assign(this._data, this.$options.data())
      },
      //点击添加按钮，需要初始化数据的回调
      async addSpuData(category3Id) {
        //将父组件传递的三级标题的id保存起来，服务器需要的参数
        this.spu.category3Id = category3Id
        //获取品牌数据
        let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
        if(tradeMarkResult.code == 200) {
          this.tradeMarkList = tradeMarkResult.data
        }
        //获取平台中全部的销售属性
        let saleAttrResult = await this.$API.spu.reqSaleAttrList()
        if(saleAttrResult.code == 200) {
          this.saleAttrList = saleAttrResult.data
        }
      },
      //取消按钮的回调
      cancelSpu() {
        //点击取消，切换场景0，回到列表
        this.$emit('changeScene', {scene: 0, flag: ''})
        //清空数据 将重新执行data()，即初始化数据，赋值给响应式数据
        Object.assign(this._data, this.$options.data())
      }
    }
  }
</script>

<style> 
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>