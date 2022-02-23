
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'

// 放置状态
// 初始化的时候从缓存中读取状态 并赋值到初始化的状态上
// Vuex的持久化 如何实现 ？ Vuex和前端缓存相结合
const state = {
  // 设置token初始状态   token持久化 => 放到缓存中
  token: getToken(),  // 设置 Token 值为共享状态，初始化 vuex 的时候就先从缓存状态中读取
  userInfo: {}
}
// 修改状态
const mutations = {
    // 设置token
  setToken(state, token) {
    state.token = token  // 设置token  只是修改state的数据  123 =》 1234
    // vuex变化 => 缓存数据
     // vuex和 缓存数据的同步
    setToken(token)    // 调用 auth 的方法将 token 更新进缓存
  },
  // 删除缓存
  removeToken(state) {
    state.token = null  // 删除 vuex 的 token
    // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
    removeToken()      // 调用 auth 的方法将缓存置空
  },
  setUserInfo(state, result) {
    state.userInfo = result  //  这样是响应式
    // state.userInfo = { ...result }  //  这样也是响应式 属于浅拷贝
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
   // 定义login action  也需要参数 调用action时 传递过来的参数
    async login(context, data) {
    // 经过响应拦截器的处理之后 这里的result实际上就是 token
    const result = await login(data) // 实际上就是一个promise  result就是执行的结果
    // axios 默认给数据加了一层 data
    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit('setToken', result)
    setTimeStamp() //  设置当前的时间
  },
  // 获取用户资料action
 async getUserInfo(context) {
    const result = await getUserInfo() // result就是用户的基本资料
    const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
    const baseResult = { ...result, ...baseInfo } // 将两个接口结果合并
    // 此时已经获取到了用户的基本资料 迫不得已 为了头像再次调用一个接口
    context.commit('setUserInfo', baseResult) // 提交mutations
    // 加一个点睛之笔  这里这一步，暂时用不到，但是请注意，这给我们后边会留下伏笔
    return baseResult
  },
    // 登出的action
    logout(context) {
      // 删除token
      context.commit('removeToken') // 不仅仅删除了vuex中的 还删除了缓存中的
      // 删除用户资料
      context.commit('removeUserInfo') // 删除用户信息
      // 重置路由
      resetRouter()
      // 还有一步  vuex中的数据是不是还在
      // 要清空permission模块下的state数据
      // vuex中 user子模块  permission子模块
      // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
      // 父模块 调用 子模块的action
      context.commit('permission/setRoutes', [], { root: true })
      // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
    }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
}