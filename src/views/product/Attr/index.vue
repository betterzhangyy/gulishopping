<template>
  <div>
    <el-card style="margin: 20px 0">
      <!-- 自定义事件，需要子组件传递三级标题id，表格显示，三级分类可用，反之，则不能使用 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable" />
    </el-card>
    <el-card>
      <!-- 展示平台属性列表 -->
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格 -->
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                style="margin: 0 10px"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性 -->
      <div v-show="!isShowTable">
        <!-- 行内表单 -->
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 编辑模式 input -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <!-- 查看模式 span -->
              <span v-else @click="toEdit(row, $index)" style="display: block">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 element-ui版本2.15.x，事件使用confirm， 我们项目element-ui版本2.13.x，事件是onConfirm-->
              <el-popconfirm :title="`确定要删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length < 1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "", //一级分类id
      category2Id: "", //二级分类id
      category3Id: "", //三级分类id
      attrList: [], //接收平台属性列表
      isShowTable: true, //控制列表数据和添加|修改面板的切换
      //收集新增|修改属性信息
      attrInfo: {
        attrName: "", //属性名称
        attrValueList: [], //属性值列表
        categoryId: 0, //三级分类id
        categoryLevel: 3, //标识三级分类
      },
    };
  },
  methods: {
    //获取三级标题的id
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
      } else if (level == 2) {
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        //已经有三级分类id，调用获取平台属性数据的方法
        this.getAttrList();
      }
    },
    //获取平台属性的数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqGetAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //添加属性值（没有属性名的id），修改属性值（有属性名的id）
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true, //控制每一行查看模式和编辑模式的切换
      });
      //添加一个input框，自动聚焦，需要等dom结构完整
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    //添加属性
    addAttr() {
      //关闭表格列表
      this.isShowTable = false;
      //清空上一次遗留的数据，数据回显
      //收集三级分类id
      this.attrInfo = {
        attrName: "", //属性名称
        attrValueList: [], //属性值列表
        categoryId: this.category3Id, //三级分类id
        categoryLevel: 3, //标识三级分类
      };
    },
    //修改属性
    updateAttr(row) {
      //关闭表格列表
      this.isShowTable = false;
      //数据结构复杂，不能使用浅拷贝，要使用深拷贝
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValueList.forEach(item => {
        //默认展示查看模式
        //后面添加的属性，要想是响应式数据，能更新视图，需要使用set
        this.$set(item, 'flag', false)
      });
    },
    //将编辑模式切换为查看模式
    toLook(row) {
      //row是获取最新的添加的一行属性值数据
      //输入的属性值不能为空
      if(row.valueName.trim() == '') {
        this.$message('请输入正常的属性值')
        return
      }
      //输入的属性值不能与之前的属性值相同
      //row 最新添加的一行属性值 attrInfo.attrValueList是属性值数组，需要判断是否存在重复
      //some测试数组中是不是至少有 1 个元素通过了被提供的函数测试，返回boolean
      let isRepeat = this.attrInfo.attrValueList.some(item => {
        //让当前的属性值与除了自己之外的其他属性值比较
        if(row !== item) {
          return row.valueName === item.valueName
        }
      })
      if(isRepeat) return
      //将编辑模式变成查看模式
      row.flag = false
    },
    //点击span的事件回调--将查看模式切换为编辑模式
    toEdit(row, index) {
      //将查看模式变成编辑模式
      row.flag = true
      //需要让input聚焦
      //切换的时候，input需要重新被渲染，需要时间，要使用$nextTick，确保页面渲染完毕
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    //删除属性值
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    //保存按钮的回调，新增|修改的数据的保存
    async addOrUpdateAttr() {
      //整理参数 去除用户添加的属性值为空，flag属性
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        return item.valueName != '' && delete item.flag
      })
      try {
        //保存成功
        await this.$API.attr.reqAddOrUpdateAttrInfo(this.attrInfo)
        //返回表格页面
        this.isShowTable = true
        //提示消息
        this.$message({type: 'success', message: '保存成功'})
        //重新获取平台属性列表数据
        this.getAttrList()
      } catch (error) {
        this.$message('保存失败！')
      }
    }
  },
};
</script>

<style></style>
