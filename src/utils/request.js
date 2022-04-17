/**
 * 请求模块
 */
import axios from 'axios'
import JSONbig from 'json-bigint'

// 在非组件模块中获取 store 必须通过单独导入
import store from '@/store'
import { Toast } from 'vant'
import router from '@/router'

const refreshTokenReq = axios.create({
  baseURL: 'http://192.168.124.6:4000/'
})

const request = axios.create({
  // baseURL: 'http://ttapi.research.itcast.cn/' // 基础路径
  baseURL: 'http://192.168.124.6:4000/',
  transformResponse: [function (data) {
    try {
      return JSONbig.parse(data)
    } catch (err) {
      console.log(data)
      console.log('转换失败', err)
      return data
    }
  }]
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  const { user } = store.state

  // 如果用户已登录，统一给接口设置 token信息
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 处理完之后一定要把 config 返回，否则请求发不出去
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  const status = error.response.status

  if (status === 400) {
    Toast.fail('客服端请求参数异常')
  } else if (status === 401) {
    // token 无效
    const { user } = store.state
    if (!user || !user.token) {
      return redirectLogin()
    }

    try {
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })

      // 获取到新的token后
      user.token = data.data.token
      store.commit('setUser', user)

      // 将失败的请求重新发出去
      return request(error.cconfig)
    } catch (err) {
      console.log('3333333333333333333333333')
      redirectLogin()
    }
  } else if (status === 403) {
    Toast.fail('没有权限操作')
    // 没有权限操作
  } else if (status >= 500) {
    Toast.fail('服务端异常，请稍后重试')
    // 服务端异常
  }

  return Promise.reject(error)
})

function redirectLogin () {
  router.replace({
    name: 'login',
    // 登录成功后跳入浏览的当前页面
    query: {
      redirect: router.currentRoute.value.fullPath
    }
  })
}

export default request
