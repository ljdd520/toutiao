<template>
  <van-cell
    class="comment-item"
  >
    <template #icon>
      <van-image
        class="avatar"
        round
        fit="cover"
        :src="comment.aut_photo"
      />
    </template>

    <template #title>
      <div class="title-wrap">
        <div class="name">{{ comment.aut_name }}</div>
        <div class="like-wrap">
          <van-icon
            :name="comment.is_liking ? 'good-job' : 'good-job-o'"
            class="like-icon"
            :class="{
              liked:comment.is_liking
            }"
            @click="onCommentLike"
          />
          <span class="like-count">{{ comment.like_count===0 ? '' : comment.like_count }}</span>
        </div>
      </div>
      <div class="content">{{ comment.content }}</div>
      <div class="reply-comment">
        <span class="pubdate">{{ dayjs(comment.pubdate,'MM:DD HH:mm') }}</span>
        <van-button
          size="mini"
          class="reply-btn"
          @click="$emit('reply-click',comment)"
        >
          {{ comment.reply_count }}回复
        </van-button>
      </div>
    </template>
  </van-cell>
</template>

<script>
import { getCurrentInstance } from 'vue'
import { deleteLike, addLike } from '@/api/article'

export default {
  name: 'CommentItem',
  setup () {
    const { proxy } = getCurrentInstance()
    const dayjs = function (value, format = 'YYYY-MM-DD HH:mm:ss') {
      return proxy.$dayjs(value).format(format)
    }
    return {
      dayjs
    }
  },
  components: {},
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  methods: {
    async onCommentLike () {
      if (this.comment.is_liking) {
        await deleteLike(this.comment.com_id)
        // eslint-disable-next-line vue/no-mutating-props
        this.comment.like_count--
      } else {
        addLike(this.comment.com_id)
        // eslint-disable-next-line vue/no-mutating-props
        this.comment.like_count++
      }
      // eslint-disable-next-line vue/no-mutating-props
      this.comment.is_liking = !this.comment.is_liking
    }
  }
}
</script>

<style scoped lang="less">
  .comment-item{
    .avatar{
      width: 36px;
      height: 36px;
      margin-right: 13px;
    }
    .title-wrap{
      display: flex;
      justify-content: space-between;
    }
    .name{
      font-size: 14px;
      color: #406599;
    }
    .content{
      font-size: 16px;
      color: #222222;
    }
    .pubdate{
      font-size: 10px;
      margin-right: 10px;
    }
    .like-icon.liked{
      color: red;
    }
    .reply-comment{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .reply-btn{
        /*border: none;*/
      }
    }
  }
</style>
