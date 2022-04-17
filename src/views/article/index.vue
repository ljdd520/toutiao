<template>
    <div class="article-container">
      <!-- 导航栏 -->
      <van-nav-bar
        class="app-nav-bar"
        title="文章详情页"
        left-arrow
        @click-left="this.$router.back()"
      />

      <div class="article-wrap">
        <!-- 文章标题 -->
        <h1 class="title">{{ article.title }}</h1>

        <van-cell
          center
          class="user-info"
        >
          <template #icon>
            <van-image
              class="avatar"
              round
              fit="cover"
              :src="article.aut_photo"
            />
          </template>

          <template
            v-slot:title
          >
            <div class="name">{{ article.aut_name }}</div>
          </template>

          <template
            v-slot:label
          >
            <div class="pubdate">{{ article.pubdate }}</div>
          </template>

          <van-button
            class="follow-btn"
            :type="article.is_followed ? 'default' : 'primary'"
            :icon="article.is_followed ? '' : 'plus'"
            round
            size="small"
            @click="onFollow"
            :loading="isFollowLoading"
          >
            {{ article.is_followed ? '已关注' : '关注' }}
          </van-button>
        </van-cell>

        <!-- 内容区 -->
        <div
          class="markdown-body"
          v-html="article.content"
          ref="article-content"
        >
        </div>

        <!-- 文章评论 -->
        <comment-list
          :source="articleId"
          :list="commentList"
          @update-total-count="totalCommentCount=$event"
          @reply-click="OnReplyClick"
        />
      </div>

      <!-- 底部区域 -->
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
        <van-icon
          name="comment-o"
          class="comment-num"
          color="#777"
          :badge="totalCommentCount"
        />
        <van-icon
          :color="article.is_collected ? 'orange' : '#777'"
          :name="article.is_collected ? 'star' : 'star-o'"
          class="star"
          @click="onCollect"
          :loading="isCollectLoading"
        />
        <van-icon
          :color="article.attitude ===1 ? 'red' : '#777' "
          :name="article.attitude ===1 ? 'good-job' : 'good-job-o'"
          class="good"
          @click="onLike"
        />
        <van-icon
          name="share"
          color="#777777"
          class="share"
        />
      </div>

      <!-- 发布评论 -->
      <van-popup
        v-model:show="isPostShow"
        position="bottom"
      >
        <post-comment
          :target="articleId"
          @post-success="onPostSuccess"
        />
      </van-popup>

      <!-- 评论回复 -->
      <van-popup
        v-model:show="isReplyShow"
        position="bottom"
      >
        <comment-reply
          v-if="isReplyShow"
          :comment="replyComment"
          @close="isReplyShow=false"
          :isReplyShow="isReplyShow"
          :article-id="articleId"
        />
      </van-popup>
    </div>
</template>

<script>
import './github-markdown.css'
import { getArticleById, addCollect, deleteCollect, addLike, deleteLike } from '@/api/article'
import PostComment from './components/post-comment'
// 图片预览
import { ImagePreview } from 'vant'
import { addFollow, deleteFollow } from '@/api/user'
import CommentList from './components/comment-list'
import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  components: {
    CommentList,
    PostComment,
    CommentReply
  },
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章数据对象
      isFollowLoading: false,
      isCollectLoading: false, // 收藏的 loading 状态
      isPostShow: false,
      commentList: [], // 文章评论列表
      totalCommentCount: 0, // 评论总数量
      isReplyShow: false,
      replyComment: {}
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  methods: {
    async loadArticle () {
      const { data } = await getArticleById(this.articleId)
      this.article = data.data

      // 得到所有的 img 标签
      this.$nextTick(() => {
        this.handlePerviewImage()
      })
      // 循环 img 列表，给 img 注册点击事件
      // 在事件处理函数中 ImagePreview() 预览
    },
    handlePerviewImage () {
      // 获取文章内容 DOM 容器
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')

      // 收集所有的图片地址
      const imgPaths = []
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = function () {
          ImagePreview({
            images: imgPaths,
            startPosition: index
          })
        }
      })
    },
    async onFollow () {
      this.isFollowLoading = true
      if (this.article.is_followed) {
        // 已经关注，取消关注
        await deleteFollow(this.article.aut_id)
      } else {
        // 没有关注，添加关注
        await addFollow(this.article.aut_id)
      }
      this.article.is_followed = !this.article.is_followed
      this.isFollowLoading = false
    },
    async onCollect () {
      this.isCollectLoading = true
      if (this.article.is_collected) {
        await deleteCollect(this.article.aut_id)
      } else {
        await addCollect(this.article.aut_id)
      }
      this.article.is_collected = !this.article.is_collected
      this.isCollectLoading = false
      this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
    },
    async onLike () {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true
      })
      if (this.article.attitude === 1) {
        await deleteLike(this.article.aut_id)
        this.article.attitude = -1
      } else {
        await addLike(this.article.aut_id)
        this.article.attitude = 1
      }
      this.$toast.success(`${this.article.attitude === 1 ? '' : '取消'}点赞成功`)
    },
    onPostSuccess (comment) {
      this.commentList.unshift(comment)
      this.isPostShow = false

      this.totalCommentCount++
    },
    OnReplyClick (comment) {
      // 将点击的对象传给子组件
      this.replyComment = comment
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
  .article-wrap{
    position: fixed;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 44px;
    overflow-y: auto;
  }
  .title{
    font-size: 20px;
    color: #3a3a3a;
    padding: 14px;
    background-color: #fff;
    margin: 0;
  }
  .user-info{
    position: sticky;
    top: 0;
    z-index: 9999;
    .avatar{
      width: 35px;
      height: 35px;
      margin-right: 8px;
    }
    .name{
      font-size: 12px;
      color: #333333;
    }
    .pubdate{
      font-size: 11px;
      color: #b4b4b4;
    }
    .follow-btn{
      width: 85px;
      height: 29px;
    }
  }
  .markdown-body{
    padding: 14px;
    background-color: #fff;
    /deep/ img{
      width: 100%;
    }
  }
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
