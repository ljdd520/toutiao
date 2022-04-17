<template>
    <div class="user-chat">
      <van-nav-bar
        class="app-nav-bar"
        title="小智同学"
        left-arrow
        @click-left="this.$router.back()"
      />

      <!-- 消息列表 -->
      <van-cell-group
        class="content-message"
        ref="content-message"
      >
        <van-cell
          v-for="(message,index) in messages"
          :key="index"
          :title="message.msg"
        />
      </van-cell-group>

      <!-- 发送消息 -->
      <van-cell-group class="send-message">
        <van-field
          v-model="message"
          placeholder="输入消息"
          :border="false"
        />
        <van-button
          type="primary"
          @click="onSend"
          :disabled="!message"
        >发送</van-button>
      </van-cell-group>
    </div>
</template>

<script>
import io from 'socket.io-client'
import { setItem, getItem } from '@/utils/storage'

export default {
  name: 'UserChat',
  data () {
    return {
      message: '',
      socket: null,
      messages: getItem('chat-messages') || []
    }
  },
  watch: {
    messages: {
      handler () {
        setItem('chat-messages', this.messages)
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      },
      deep: true
    }
  },
  created () {
    // 建立连接
    const socket = io('http://localhost:4000/')
    this.socket = socket

    socket.on('connect', function () {
      console.log('连接建立成功了')
    })

    socket.on('disconnect', () => {
      console.log('断开连接了')
    })

    socket.on('message', data => {
      this.messages.push(data)
    })
  },
  mounted () {
    this.scrollToBottom()
  },
  methods: {
    onSend () {
      const data = {
        msg: this.message,
        timestamp: Date.now()
      }
      this.socket.emit('message', data)

      // 将用户发出去的消息存储到数组中
      this.messages.push(data)

      this.message = ''
    },
    scrollToBottom () {
      // const list = this.$refs['content-message']
      const list = document.querySelector('.content-message')
      list.scrollTop = list.scrollHeight
    }
  }
}
</script>

<style scoped lang="less">
  .send-message{
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
  }
  .content-message{
    position: fixed;
    overflow-y: auto;
    left: 0;
    right: 0;
    bottom: 44px;
    top: 46px;
  }
</style>
