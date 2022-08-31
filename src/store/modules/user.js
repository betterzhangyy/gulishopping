import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter, constantRoutes, asyncRoutes, anyRoutes } from '@/router'

const getDefaultState = () => {
  return {
    //存储token
    token: getToken(),
    //存储用户名
    name: '',
    //存储用户头像
    avatar: '',
    //存储用户权限
    routes: [],
    //存储用户角色
    roles: [],
    //存储用户能操作的按钮
    buttons: [],
    //存储计算出来的用户的异步路由
    asyncRoutesResult: [],
    //用户所有的路由集合（常量、异步、任意）
    allRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  //存储服务器返回的用户信息数据
  SET_USERINFO(state, userInfo) {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.routes = userInfo.routes
    state.roles = userInfo.roles
    state.buttons = userInfo.buttons
  },
  //存储计算出来的用户的异步路由
  COMPUTE_ASYNCROUTES(state, asyncRoutesResult) {
    //vuex保存当前用户的异步路由，注意，一个用户需要展示完成路由：常量、异步、任意路由
    state.asyncRoutesResult = asyncRoutesResult
    //合并用户所有的路由
    state.allRoutes = [...constantRoutes, ...asyncRoutesResult, anyRoutes]
    //给路由器添加新的路由
    router.addRoutes(state.allRoutes)
  } 
}

const actions = {
  // 用户登录
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    if(result.code == 20000) {
      //请求成功后，服务器会返回token，需要永久存储
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      //请求失败
      return Promise.reject(new Error('faile'))
    }
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        //根据token，获取服务器用户信息，里面的数据都要存储
        //包含：用户名name、头像avatar、权限的标志routes、角色roles、按钮的标志buttons
        commit('SET_USERINFO', data)
        //计算出异步路由（比较我们定义的路由，服务器返回的用户路由标志）
        commit('COMPUTE_ASYNCROUTES', computeAsyncRoutes(asyncRoutes, data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出登录
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

/**
 * 计算异步路由，从全部展示的异步路由中，过滤出每个角色独有的路由标志
 * asyncRoutes：全部异步路由
 * routes： 服务器返回的用户的路由标志
 */
const computeAsyncRoutes = (asyncRoutes, routes) => {
  // console.log(asyncRoutes)
  // console.log(routes)
  //过滤出要展示的异步路由
  return asyncRoutes.filter(item => {
    //一级路由
    if(routes.includes(item.name)) {
      if(item.children && item.children.length > 0) {
        //需要递归，可能存在2、3、4、5、6级路由，子路由也需要过滤
        item.children = computeAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

