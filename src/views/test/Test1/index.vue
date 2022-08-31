<template>
  <div>
    <el-button type="primary" v-show="$store.state.user.buttons.includes('btn.Test.add1')">添加按钮1</el-button>
    <el-button type="primary" v-show="$store.state.user.buttons.includes('btn.Test.add2')">添加按钮2</el-button>
  </div>
</template>

<script>
export default {
  name: 'Test1',
}
</script>

<style scoped>

</style>
