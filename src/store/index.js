import { createStore } from 'vuex'
import { getItem, setItem } from '@/utils/storage'

// 防止输入的键值对不一致
const USER_KEY = 'toutiao-user'

export default createStore({
  state: {
    // user: JSON.parse(window.localStorage.getItem('user')) // 当前登录用户的登录状态（token等数据）
    user: getItem(USER_KEY),

    // 缓存页面
    cachePages: ['LayoutIndex']
  },
  getters: {
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // 为了防止页面刷新数据丢失，将数据保存到本地存储中，持久化数据。
      // window.localStorage.setItem('user', JSON.stringify(state.user))
      setItem(USER_KEY, state.user)
    },
    addCachePage (state, pageName) {
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName)
      }
    },
    deleteCachePage (state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      if (index !== -1) {
        state.cachePages.splice(index, 1)
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
