<template>
    <div class="search-suggestion">
      <van-cell
        icon="search"
        v-for="(str,index) in suggestions"
        :key="index"
        @click="$emit('search',str)"
      >
        <template #title>
          <div  v-html="highlight(str)"></div>
        </template>
      </van-cell>
    </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据
    }
  },
  computed: {},
  watch: {
    // 属性名：要监视的数据名称
    searchText: {
      handler: debounce(async function () {
      // 找到数据接口
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
        // 请求获取数据
        // 模板绑定展示
      }, 200),
      immediate: true
    }
  },
  methods: {
    highlight (str) {
      const regex = new RegExp(this.searchText, 'gi')
      return str.replace(regex, `<span style="color: red">${this.searchText}</span>`)
    }
  }
}
</script>

<style scoped>

</style>
