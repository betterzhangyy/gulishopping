<template>
  <div>
    <!-- 行内表单： inline: 让表单域变为行内的表单域 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级标题">
        <!-- select收集的是option的value值 @change是自定义事件，但elementUI已经做过封装，直接使用就是原生的change事件-->
        <el-select placeholder="请选择" v-model="cmFrom.category1Id" @change="getCategory2List" :disabled="show">
          <!-- 遍历option -->
          <el-option :label="c1.name" :value="c1.id" v-for="c1 in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级标题">
        <el-select placeholder="请选择" v-model="cmFrom.category2Id" @change="getCategory3List" :disabled="show">
          <el-option :label="c2.name" :value="c2.id" v-for="c2 in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级标题">
        <el-select placeholder="请选择" v-model="cmFrom.category3Id" @change="changeCategory3Id" :disabled ="show"> 
          <el-option :label="c3.name" :value="c3.id" v-for="c3 in list3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ['show'],
  data() {
    return {
      list1: [], //一级分类
      list2: [], //二级分类
      list3: [], //三级分类
      cmFrom: {
        category1Id: '', //一级分类id
        category2Id: '', //二级分类id
        category3Id: ''  //三级分类id
      }
    }
  },
  mounted() {
    //调用一级分类
    this.getCategory1List()
  },
  methods: {
    //获取一级分类
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List()
      if(result.code == 200) {
        this.list1 = result.data
      }
    },
    //当一级分类option发生变化时，获取二级分类
    async getCategory2List() {
      //清空二级分类、三级分类
      this.list2 = []
      this.list3 = []
      this.cmFrom.category2Id = ''
      this.cmFrom.category3Id = ''
      const {category1Id} = this.cmFrom
      //给父组件传递参数
      this.$emit('getCategoryId', {categoryId: category1Id, level: 1})
      let result = await this.$API.attr.reqCategory2List(category1Id)
      if(result.code == 200) {
        this.list2 = result.data
      }
    },
    //当二级分类option发生变化时，获取三级分类
    async getCategory3List() {
      //清空三级分类
      this.list3 = []
      this.cmFrom.category3Id = ''
      const {category2Id} = this.cmFrom
      //给父组件传递参数
      this.$emit('getCategoryId', {categoryId: category2Id, level: 2})
      let result = await this.$API.attr.reqCategory3List(category2Id)
      if(result.code == 200) {
        this.list3 = result.data
      }
    },
    changeCategory3Id() {
      const {category3Id} = this.cmFrom
      //给父组件传递参数
      this.$emit('getCategoryId', {categoryId: category3Id, level: 3})
    }
  },
}
</script>

<style></style>
