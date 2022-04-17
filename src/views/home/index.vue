<template>
  <div class="home-container">
    <van-nav-bar class="app-nav-bar">
      <template v-slot:title>
        <van-button
          icon="search"
          type="primary"
          size="small"
          round
          class="search-btn"
          to="/search"
        >搜索</van-button>
      </template>
    </van-nav-bar>

    <!-- 文章频道列表 -->
    <van-tabs
      class="channel-tabs"
      v-model:active="active"
    >
      <van-tab
        class="tab-item"
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <!-- 渲染对应的频道 -->
        <article-list :channel="channel"/>
      </van-tab>

      <!-- 为了使下面的弹出菜单不挡住列表添加一个占位列表 -->

      <!-- 使用slot插入一个菜单栏 -->
      <template v-slot:nav-right>
        <div
          @click="isChannelEditShow=true"
          class="wap-nav-wrap"
        >
          <van-icon name="wap-nav"/>
        </div>
      </template>
    </van-tabs>

    <!-- 弹出层不属于任何一个结构 -->
    <van-popup
      v-model:show="isChannelEditShow"
      position="bottom"
      closeable
      class="channel-edit-popup"
      teleport="body"
      :style="{height:'100%'}"
    >
      <!--
      封装一个组件
      @close是子组件向父组件通信
      :active是高亮用来判断动态绑定的类名
      -->
      <channel-edit
        :user-channels="channels"
        :active="active"
        @close="isChannelEditShow=false"
        @update-active="onUpdateActive"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { ref } from 'vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  setup () {
    const active = ref(0)
    return { active }
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      // active: 0,
      channels: [],
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      // 请求获取频道数据
      // const { data } = await getUserChannels()
      // this.channels = data.data.channels
      let channels = []
      if (this.user) {
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        // 没有登录，判断是否有本地的频道数据列表
        const localChannels = getItem('user-channels')
        // 如果有本地存储的列表
        if (localChannels) {
          channels = localChannels
        } else {
          // 用户没有登录，也没有本地存储的频道
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      this.channels = channels
    },
    // 激活对应的标签页
    onUpdateActive (index) {
      this.active = index
    }
  }
}
</script>

<style scoped lang="less">
  .home-container{
    /deep/ .van-tabs__wrap{
      margin-right: 34px;
    }
    /deep/ .van-nav-bar__title{
      max-width: unset;
    }

    /deep/ .search-btn{
      width: 277px;
      height: 32px;
      background: #5babfb;
      border: none;
      .van-icon{
        font-size: 16px;
      }
      .van-button__text{
        font-size: 14px;
      }
    }

    /deep/ .channel-tabs{
      .van-tab{
        box-sizing: border-box;
        border-right: 1px solid #edeff3;
        border-bottom: 1px solid #edeff3;
        min-width: 85px;
        /*background-color: red;*/
      }
      .van-tabs__line{
        width: 15px;
        height: 3px;
        background-color: #3296fa;
        bottom: 20px;
      }
    }

    /* 弹出层的样式 */
    .wap-nav-wrap{
      box-sizing: border-box;
      position: fixed;
      right: 0;
      width: 43px;
      height: 43px;
      line-height: 44px;
      background-color: #fff;
      opacity: .8;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid rgba(237,239,243,.6);
      border-bottom: none;
      /deep/ .van-icon{
        font-size: 24px;
      }
    }
  }

</style>
