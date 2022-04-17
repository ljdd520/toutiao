<template>
    <div
      class="article-list"
      ref="article-list"
    >
      <van-pull-refresh
        v-model="isRefreshLoading"
        :success-text="refreshSuccessText"
        :success-duration="1000"
        @refresh="onRefresh"
      >

      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
<!--        <van-cell-->
<!--          v-for="(article,index) in articles"-->
<!--          :key="index"-->
<!--          :title="article.title" />-->
        <article-item
          v-for="(article,index) in articles"
          :key="index"
          :article="article"
        />
      </van-list>
      </van-pull-refresh>
    </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
import { debounce } from 'lodash'

export default {
  name: 'article-list',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      articles: [], // 数据列表
      loading: false, // 控制加载中的loading状态
      finished: false, // 控制加载结束，不再进行加载
      timestamp: null,
      isRefreshLoading: false, // 下拉刷新
      refreshSuccessText: '', // 下拉刷新成功的提示文字
      scrollTop: 0 // 列表到顶部的距离
    }
  },
  mounted () {
    const articleList = this.$refs['article-list']
    articleList.onscroll = debounce(() => {
      console.log(articleList.scrollTop)
      this.scrollTop = articleList.scrollTop
    }, 50)
  },
  activated () {
    this.$refs['article-list'].scrollTop = this.scrollTop
  },
  // deactivated () {
  //   const articleList = this.$refs['article-list']
  //   articleList.onscroll = debounce(() => {
  //     console.log(articleList.scrollTop)
  //     this.scrollTop = articleList.scrollTop
  //   }, 50)
  // },
  methods: {
    async onLoad () {
      // 1.请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道 ID
        // timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史数据传指定的时间戳
        timestamp: this.timestamp || '1648804916088',
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含，0-不包含
      })
      // console.log(data)
      // 2.把数据放到 article 中
      const { results } = data.data
      this.articles.push(...results)

      // 3.设置本次加载状态结束，它才可以判断是否需要加载下一次，否则停止。
      this.loading = false

      // 数据全部加载完成
      if (results.length) {
        // 更新获取下一页数据的页码
        this.timestamp = data.data.pre_timestamp
      } else {
        // 没有数据结束加载
        this.finished = true
      }
    },
    async onRefresh () {
      // *下拉刷新，组件自己展示 loading 状态
      // 1. 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      // 2. 把数据放到数据列表中（往顶部追加）
      const { results } = data.data
      this.articles.unshift(...results)
      // 3. 关闭刷新的状态 loading
      this.isRefreshLoading = false

      this.refreshSuccessText = `更新了${results.length}条数据`
    }
  }
}
</script>

<style scoped lang="less">
  .article-list{
    position: fixed;
    left: 0;
    right: 0;
    top: 90px;
    bottom: 50px;
    overflow-y: auto;
  }
</style>
