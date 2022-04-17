<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchText)"
        @cancel="onCancel"
        @focus="isResultShow=false"
      />
    </form>

    <!-- 搜索结果 -->
    <search-result
      v-if="isResultShow"
      :search-text="searchText"
    />

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />

    <!-- 搜索历史 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @search="onSearch"
      @update-histories="searchHistories=$event"
    />

  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
import { getSearchHistories } from '@/api/search'
import { mapState } from 'vuex'

export default {
  name: 'SearchIndex',
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  props: {},
  data () {
    return {
      searchText: '',
      isResultShow: false, // 是否显示搜索结果
      searchHistories: [] // 搜索历史数据
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    searchHistories () {
      setItem('search-histories', this.searchHistories)
    }
  },
  created () {
    this.loadSearchHistories()
  },
  methods: {
    Trim (str) {
      return str.replace(/(^\s*)|(\s*$)/g, '')
    },
    onSearch (searchText) {
      // 把输入框设置为你要搜索的文本
      this.searchText = searchText.trim()

      // 记录搜索历史记录
      const index = this.searchHistories.indexOf(searchText.trim())
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(searchText.trim())
      const strIndex = this.searchHistories.indexOf('')
      if (strIndex !== -1) {
        this.searchHistories.splice(strIndex, 1)
      }

      setItem('search-histories', this.searchHistories)
      // 展示搜索结果
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    },
    async loadSearchHistories () {
      let searchHistories = getItem('search-histories') || []

      // 用户已经登录
      if (this.user) {
        const { data } = await getSearchHistories()
        searchHistories = [...new Set([
          ...searchHistories,
          ...data.data.keywords
        ])]
      }

      this.searchHistories = searchHistories
    }
  }
}
</script>

<style scoped lang="less">
</style>
