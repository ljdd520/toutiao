<template>
    <div class="comment-reply">
      <!-- 头部信息 -->
      <van-nav-bar :title="`${comment.reply_count}条回复`">
        <template #left>
          <van-icon
            name="cross"
            @click="$emit('close')"
          />
        </template>
      </van-nav-bar>

      <!-- 当前评论项 -->
      <comment-item
        :comment="comment"
      />

      <comment-list
        :source="comment.com_id"
        type="c"
        :isReplyShow="isReplyShow"
        :list="commentList"
      />

      <div class="article-bottom">
        <van-button
          class="comment-btn"
          type="default"
          round
          size="small"
          @click="isPostShow=true"
        >
          写评论
        </van-button>
      </div>

      <!-- 发布回复 -->
      <van-popup
        v-model:show="isPostShow"
        position="bottom"
      >
        <post-comment
          :target="comment.com_id"
          :article-id="articleId"
          @post-success="onPostSuccess"
        />
      </van-popup>
    </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import PostComment from './post-comment'

export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    PostComment
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    isReplyShow: {
      type: Boolean,
      default: false
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      isPostShow: false,
      commentList: []
    }
  },
  methods: {
    onPostSuccess (comment) {
      // 将发布成功的数据放到列表的顶部
      this.commentList.unshift(comment)

      // eslint-disable-next-line vue/no-mutating-props
      this.comment.reply_count++

      this.isPostShow = false
    }
  }
}
</script>

<style scoped lang="less">
  .article-bottom{
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 44px;
    background-color: #fff;
    display: flex;
    align-items: center;
    border: 1px solid rgba(237, 239, 243, 1);
    justify-content: space-around;
    flex-direction: row;
    line-height: 44px;
    flex-shrink: 1;
    font-size: 24px;
    .comment-btn{
      height: 60%;
      color: #b4b4b4;
      width: 150px;
    }
  }
</style>
