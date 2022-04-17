<template>
  <van-cell
    class="article-item"
    :to="{
    name:'article',
    params:{
      articleId:article.art_id
    }
    }"
  >
    <template #title>
      <div class="title van-multi-ellipsis--l3" >
        {{ article.title }}
      </div>
    </template>
    <template #label>
      <div
        class="cover-wrap"
        v-if="article.cover.type===3"
      >
        <div
          class="cover-wrap-item"
          v-for="(img,index) in article.cover.images"
          :key="index"
        >
          <van-image
            class="cover-item"
            fit="cover"
            :src="img"
          />
        </div>
      </div>

      <div class="label-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ dayjs(article.pubdate) }}</span>
      </div>
    </template>

    <!-- 默认插槽 -->
    <template #default>
      <van-image
        v-if="article.cover.type===1"
        class="right-cover"
        fit="cover"
        :src="article.cover.images[0]"
      />
    </template>
  </van-cell>
</template>

<script>
import { getCurrentInstance } from 'vue'

export default {
  setup () {
    const { proxy } = getCurrentInstance()
    const dayjs = function (value) {
      return proxy.$dayjs(value).from(proxy.$dayjs())
    }
    return {
      dayjs
    }
  },
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  }
}
</script>

<style scoped lang="less">
  .article-item{
    /deep/ .van-cell__label{
      margin-top: 0;
    }
    .title{
      font-size: 16px;
      color: #3a3a3a;
    }
    /deep/ .van-cell__value{
      flex: unset;
      width: 116px;
      height: 73px;
      margin-left: 12px;
    }
    .cover-wrap{
      /*padding: 15px 0;*/
      padding: 10px 0;
      width: 343px;
      display: flex;
      .cover-wrap-item{
        box-sizing: border-box;
        flex: 1;
        height: 73px;
        &:not(:last-child){
          padding-right: 4px;
        }
        .cover-item{
          width: 100%;
          height: 73px;
        }
      }
    }
    .label-wrap{
      font-size: 11px;
      color: #b4b4b4;
      bottom: 0;
    }
    .label-wrap span{
      margin-right: 12px;
    }
    /deep/ .van-cell__title{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
</style>
