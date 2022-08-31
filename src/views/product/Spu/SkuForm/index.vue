<template>
  <div>
    <el-form ref="form" label-width="80px" :model="skuInfo">
      <el-form-item label="SPU名称">
        {{spu.spuName}}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model.number="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" placeholder="规格描述" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <!-- 行内表单 -->
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <!-- 需要存储属性名的id和属性值的id -->
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.saleAttrIdAndSaleAttrValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <!-- 表格 selection-change：当选择项发生变化时会触发该事件-->
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80"></el-table-column>
          <el-table-column label="图片" width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" style="width:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{row}">
              <!-- isDefault：0代表显示设为默认的按钮，1代表显示默认的按钮 -->
              <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row, spuImageList)">设为默认</el-button>
              <el-button type="success" plain v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSku">保存</el-button>
        <el-button @click="cancelSku">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'SkuForm',
    data() {
      return {
        spuImageList: [],  //存储图片列表数据
        spuSaleAttrList: [],  //存储销售属性列表数据
        attrInfoList: [],  //平台属性列表数据
        //保存sku，需要带给服务器的参数
        skuInfo: {
          //第一类参数：父组件带给我们的参数
          category3Id: 0,  //三级标题id
          spuId: 0,  //spu的id
          tmId: 0,  //品牌的id
          //第二类参数：通过v-model可以收集的表单项的参数
          skuName: '',  //sku名称
          price: 0,   //价格 
          weight: '',  //重量
          skuDesc: '',  //描述
          //第三类参数：需要通过代码整理参数
          skuAttrValueList: [    //平台属性
            // {
            //   attrId: 0,  //属性名的id
            //   valueId: 0,  //属性值的id
            // }
          ],
          skuSaleAttrValueList: [  //销售属性
            // {
            //   saleAttrId: 0,  //销售属性名id
            //   saleAttrValueId: 0,  //销售属性值id
            // }
          ],
          skuDefaultImg: '',  //设为默认图片的url
          skuImageList: [
            // {
            //   imgName: '',
            //   imgUrl: '',
            //   isDefault: '',  //0表示不是默认图片，1表示默认图片，同时可以用于控制两个按钮的切换
            //   spuImgId: 0   //图片的id
            // }
          ]
        },
        spu: {},   //存储spu数据
        imageList: [],  //存储选中的图片的列表
      }
    },
    methods: {
      //点击添加sku，初始化界面数据
      async getSkuData(spu, category1Id, category2Id) {
        //收集父组件给我们传递的参数
        this.skuInfo.category3Id = spu.category3Id
        this.skuInfo.spuId = spu.id
        this.skuInfo.tmId = spu.tmId
        this.spu = spu
        //获取图片数据
        let result1 = await this.$API.spu.reqSpuImageInfo(spu.id)
        if(result1.code == 200) {
          let list = result1.data
          //给服务器返回的每一个图片对象，都添加一个isDefault属性，用于区分两个按钮的切换
          list.forEach(item => item.isDefault = 0)  //0表示显示'设为默认'的按钮
          this.spuImageList = list
        }
        //获取销售属性数据
        let result2 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
        if(result2.code == 200) {
          this.spuSaleAttrList = result2.data
        }
        //获取平台属性数据
        let result3 = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
        if(result3.code == 200) {
          this.attrInfoList = result3.data
        }
      },
      //获取选中的图片的列表的回调
      handleSelectionChange(selection) {
        //selection：返回选中一行对象组成的数组
        this.imageList = selection
      },
      //点击设为默认按钮触发的回调，切换为默认按钮，其他皆为设为默认按钮
      changeDefault(row, spuImageList) {
        //排他操作，只能有一个默认按钮
        spuImageList.forEach(item => item.isDefault = 0)
        //将当前点击的按钮设置为默认按钮
        row.isDefault = 1
        //设为默认图片，需要保存url，给服务器
        this.skuInfo.skuDefaultImg = row.imgUrl
      },
      //取消sku
      cancelSku() {
        //触发自定义事件，告知父组件切换场景0 
        this.$emit('changeScenes', 0)
        //清空数据
        Object.assign(this._data, this.$options.data())
      },
      //保存sku信息，提交服务器存储
      async saveSku() {
        //解构数据
        const {attrInfoList, skuInfo, spuSaleAttrList, spuImageList} = this
        //整理平台属性参数
        skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
          if(item.attrIdAndValueId) {
            //将对象的attrIdAndValueId按:切割为一个数组
            const [attrId, valueId] = item.attrIdAndValueId.split(':')
            prev.push({attrId, valueId})
          }
          return prev
        }, [])
        //整理销售属性参数
        skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
          if(item.saleAttrIdAndSaleAttrValueId) {
            const [saleAttrId, saleAttrValueId] = item.saleAttrIdAndSaleAttrValueId.split(':')
            prev.push({saleAttrId, saleAttrValueId})
          }
          return prev
        }, [])
        //整理图片列表参数
        skuInfo.skuImageList = spuImageList.map(item => {
          return {
            imgName: item.imgName,
            imgUrl: item.imgUrl,
            isDefault: item.isDefault,  
            spuImgId: item.id
          }
        })
        //参数整理完毕，发请求，向服务器存储数据
        let result = await this.$API.spu.reqSaveSkuInfo(skuInfo)
        if(result.code == 200) {
          this.$message({type: 'success', message: '保存SKU成功'})
          //通知父组件，切换场景为0
          this.$emit('changeScenes', 0)
          //清空数据
          Object.assign(this._data, this.$options.data())
        }
      }
    },
  }
</script>

<style>

</style>