<template>
  <div class="search-history">
    <van-cell
      title="搜索历史"
    >
      <div v-if="isDeleteShow">
        <span
          @click="$emit('update-histories',[])"
        >全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow=false">完成</span>
      </div>
      <van-icon
        v-else
        name="delete"
        @click="isDeleteShow=true"
      />
    </van-cell>
    <van-cell
      v-for="(history,index) in searchHistories"
      :key="index"
      :title="history"
      @click="onDelete(history,index)"
    >
      <van-icon
        v-show="isDeleteShow"
        name="close"
      />
    </van-cell>
  </div>
</template>

<script>
import { setItem } from '@/utils/storage'

export default {
  name: 'SearchHistory',
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false // 删除的显示状态
    }
  },
  methods: {
    onDelete (history, index) {
      if (this.isDeleteShow) {
        // eslint-disable-next-line vue/no-mutating-props
        this.searchHistories.splice(index, 1)

        /**
         * 持久化处理
         * 1. 修改本地存储的数据
         * 2. 请求接口删除线上的数据
         */
        setItem('search-histories', this.searchHistories)
        return
      }
      // 非删除状态，展示搜索结果
      this.$emit('search', history)
    }
  }
}
</script>

<style scoped>

</style>
