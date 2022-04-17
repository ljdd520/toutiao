<template>
    <div class="search-result">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell
          v-for="(article,index) in list"
          :key="index"
          :title="article.title"
        />
      </van-list>

    </div>
</template>

<script>
import { ref } from 'vue'
import { getSearchResult } from '@/api/search'

export default {
  name: 'SearchResult',
  setup () {
    const list = ref([])
    const loading = ref(false)
    const finished = ref(false)

    return {
      list,
      loading,
      finished
    }
  },
  data () {
    return {
      page: 1,
      per_page: 10,
      q: ''
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  methods: {
    async onLoad () {
      // 请求获取数据
      const { data } = await getSearchResult({
        page: this.page, // 页码
        per_page: this.per_page, // 每页大小
        q: this.searchText // 搜索字符
      })
      // 将数据放入到数据列表中
      const { results } = data.data
      this.list.push(...results)

      // 关闭本次的loading
      this.loading = false

      // 判断是否还有数据
      if (results.length) {
        this.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang="less">
  .search-result{
    position: fixed;
    left: 0;
    right: 0;
    top: 54px;
    bottom: 0;
    overflow-y: auto;
  }
</style>
