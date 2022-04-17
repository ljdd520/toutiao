<template>
    <div class="post-comment">
      <van-field
        v-model.trim="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入留言"
        show-word-limit
      />
      <van-button
        @click="onPost"
        :disabled="!message"
      >发布</van-button>
    </div>
</template>

<script>
import { addComment } from '@/api/article'

export default {
  name: 'PostComment',
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  data () {
    return {
      message: ''
    }
  },
  methods: {
    async onPost () {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true
      })
      const { data } = await addComment({
        target: this.target,
        content: this.message,
        art_id: this.articleId
      })
      this.$emit('post-success', data.data.new_obj)
      this.$toast.success('发布成功')
      this.message = ''
    }
  }
}
</script>

<style scoped lang="less">
  .post-comment{
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    /*padding: 0 14px;*/
  }
</style>
