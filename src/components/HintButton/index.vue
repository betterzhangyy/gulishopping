<template>
  <!-- 将element-ui中button，封装成一个带有提示的按钮 -->
  <a :title="title" style="margin: 0 10px">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  name: 'HintButton',
  props: ['title']
}
</script>

<style>

</style>