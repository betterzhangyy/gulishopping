<template>
  <div>
    <el-button type="primary" v-show="$store.state.user.buttons.includes('btn.Test.add3')">添加按钮3</el-button>
  </div>
</template>

<script>
export default {
  name: 'Test2',
}
</script>

<style scoped>

</style>
