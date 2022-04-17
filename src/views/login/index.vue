<template>
    <div class="login-container">
      <van-nav-bar
        class="app-nav-bar"
        title="注册 / 登录"
        left-arrow
        @click-left="this.$router.back()"
      />
      <!-- 登录表单 -->
      <!--
          1.使用van-form组件包裹所有的表单项 van-field
          2.给van-form绑定submit事件当表单提交时会触发onLogin
      -->
      <van-form
        @submit="onLogin"
        @failed="onFailed"
        :validate-first="true"
        :show-error="false"
        :show-error-message="false"
        ref="login-form"
      >
        <van-field
          v-model="user.mobile"
          icon-prefix="iconfont icon-shouji"
          left-icon="shouji"
          placeholder="请输入手机号"
          name="mobile"
          :rules="formRules.mobile"
          center
        />
        <van-field
          v-model="user.code"
          icon-prefix="iconfont icon-yanzhengma"
          clearable
          left-icon="yanzhengma"
          placeholder="请输入验证码"
          :rules="formRules.code"
          name="code"
          center
        >
          <!-- 验证码 -->
          <template #button>
            <!-- 倒计时 -->
            <van-count-down
              v-if="isCountDownShow"
              :time="time"
              format="ss s"
              class="time-btn"
              @finish="isCountDownShow=false"
            />
            <van-button
              v-else
              class="send-btn"
              size="mini"
              round
              @click.prevent="onSendSms"
              :loading="isSendSmsLoading"
            >发送验证码</van-button>
          </template>
        </van-field>
        <div class="login-btn-wrap">
          <van-button
            class="login-btn"
            type="primary"
            block
            native-type="submit"
          >登录</van-button>
        </div>
      </van-form>
    </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
// import { Toast } from 'vant'
export default {
  /**
   * 笔记
   * $router.back()表示回到上一次的路由
   */
  name: 'LoginIndex',
  data () {
    return {
      time: 1000 * 5,
      user: {
        mobile: 15284605017, // 手机号
        code: '' // 验证码
      },
      // 表单验证规则
      formRules: {
        mobile: [
          { required: true, message: '请输入电话号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false, // 控制倒计时
      isSendSmsLoading: false // 发送验证码按钮的loading状态
    }
  },
  methods: {
    async onLogin () {
      // 登录提示
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true,
        duration: 0
      })
      // 1.找到数据接口
      // 2.封装请求方法
      // 3.请求调用登录
      try {
        const res = await login(this.user)
        this.$toast.success('登陆成功')
        // 将后端返回的用户登录状态（token）放入到Vuex容器中
        this.$store.commit('setUser', res.data.data)

        // 清除 layout 的缓存，重新渲染
        this.$store.commit('deleteCachePage', 'LayoutIndex')

        // 登录成功，跳转到原来的页面
        // this.$router.back()

        this.$router.push(this.$route.query.redirect || '/home')
      } catch (err) {
        this.$toast.fail('登陆失败，手机或验证码错误')
      }
      // 4.处理响应结果
    },
    onFailed (error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message,
          position: 'top'
        })
      }
    },
    async onSendSms () {
      // 校验手机号
      // 验证提供->请求发送验证码->用户接收短信->
      // 输入验证码->请求登录
      // 请求发送验证码->隐藏发送按钮，显示倒计时
      // 倒计时结束->隐藏倒计时，显示发送按钮
      try {
        await this.$refs['login-form'].validate('mobile')

        // this.isSendSmsLoading = true // 展示按钮的loading状态
        // 验证通过 请求发送验证码
        await sendSms(this.user.mobile)
        // 短信成功发出，隐藏发送按钮，显示倒计时。
        this.isCountDownShow = true
        // @finish事件是结束时触发的
      } catch (err) {
        // 这里可以捕获所有的异常
        let message = ''
        if (err && err.response && err.response.status === 429) {
          message = '发送太频繁了，请稍后'
        } else if (err.name === 'mobile') {
          message = err.message
        } else {
          message = '发送失败，请稍后重试'
        }
        this.$toast({
          message,
          position: 'top'
        })
      }

      // 无论验证码是否发送成功，取消loading状态
      this.isSendSmsLoading = false
    }
  }
}
</script>

<style scoped lang="less">
  .login-container{
    .van-field{
      height: 41.3px;
    }
    .send-btn{
      vertical-align: top;
      width: 76px;
      height: 23px;
      background-color: #ededed;
      .van-button__text{
        font-size: 11px;
        color: #666666;
      }
    }
    .login-btn-wrap{
      padding: 26px 16px;
      .login-btn{
        background-color: #6db4fd;
        border: none;
        .van-button__text{
          font-size: 15px;
        }
      }
    }
  }
</style>
