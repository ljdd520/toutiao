<template>
    <div class="comment-list">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell>{{ isReplyShow?'所有回复':'全部评论' }}</van-cell>
        <comment-item
          v-for="(comment,index) in list"
          :key="index"
          :comment="comment"
          @reply-click="$emit('reply-click',$event)"
        />
      </van-list>
    </div>
</template>

<script>
import { ref } from 'vue'
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  setup () {
    // const list = ref([])
    const loading = ref(false)
    const finished = ref(false)

    return {
      // list,
      loading,
      finished
    }
  },
  data () {
    return {
      offset: null,
      limit: 10
    }
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    /**
     * 1. 获取文章评论，使用字符 a
     * 2. 获取评论回复，使用字符c
     */
    type: {
      type: String,
      default: 'a'
    },
    list: {
      type: Array,
      default: function () {
        return []
      }
    },
    isReplyShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async onLoad () {
      // 1. 请求数据
      const { data } = await getComments({
        type: this.type,
        source: this.source,
        offset: this.offset,
        limit: this.limit
      })
      this.$emit('update-total-count', data.data.total_count)
      // 2. 把数据放到列表中
      const { results } = data.data
      // eslint-disable-next-line vue/no-mutating-props
      this.list.push(...results)
      // 3. 将本次的 loading 关闭
      this.loading = false
      // 4. 判断是否还有数据
      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped>

</style>
