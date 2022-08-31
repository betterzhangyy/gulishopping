import mockRequest from '@/utils/mockRequest'
const state = {
  list: {}  //存储主页数据
}
const mutations = {
  GETHOMEDATA(state, list) {
    state.list = list
  }
}
const actions = {
  //发请求获取首页的mock数据
  async getHomeData({commit}) {
    let result = await mockRequest.get('/home/list')
    if(result.code == 20000) {
      commit('GETHOMEDATA', result.data)
    }
  }
}
const getters = {}
export default {
  state,
  mutations,
  actions,
  getters
}