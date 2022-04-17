<template>
  <div class="my-container">
    <van-cell-group v-if="user" class="my-info">
      <van-cell
        class="base-info"
        title=""
        value=""
        center
        :border="false"
      >
        <template v-slot:icon>
          <van-image
            class="avatar"
            fit="cover"
            round
            :src="currentUser.photo"
          />
        </template>
        <template v-slot:title>
          <div class="name">{{ currentUser.name }}</div>
        </template>
        <van-button
          class="update-btn"
          size="small"
          round
          to="/user/profile"
        >编辑资料</van-button>
      </van-cell>

      <van-grid class="data-info" :border="false">
        <van-grid-item class="data-info-item">
          <template v-slot:text>
            <div class="text-wrap">
              <div class="count">{{ currentUser.art_count }}</div>
              <div class="text">头条</div>
            </div>
          </template>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <template v-slot:text>
            <div class="text-wrap">
              <div class="count">{{ currentUser.follow_count }}</div>
              <div class="text">关注</div>
            </div>
          </template>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <template v-slot:text>
            <div class="text-wrap">
              <div class="count">{{ currentUser.fans_count }}</div>
              <div class="text">粉丝</div>
            </div>
          </template>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <template v-slot:text>
            <div class="text-wrap">
              <div class="count">{{ currentUser.like_count }}</div>
              <div class="text">获赞</div>
            </div>
          </template>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <!-- 未登录状态下 -->
    <div  v-else class="not-login">
      <div @click="this.$router.push({
      name:'login',
      query:{
        redirect:'/my'
      }
      })">
        <img src="./shouji.png" class="mobile">
      </div>
      <div class="text">登录 / 注册</div>
    </div>

    <van-grid class="nav-grid mb-4" :column-num="2">
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="iconfont icon-shoucang"
        icon="shoucang"
        text="收藏"
      />
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="iconfont icon-lishi"
        icon="lishi"
        text="历史"
      />
    </van-grid>

    <van-cell title="消息通知" is-link to="" />
    <van-cell
      title="小智同学"
      class="mb-4"
      is-link
      to="/user/chat"
    />
    <van-cell
      v-if="user"
      title="退出登录"
      class="logout-btn"
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'

export default {
  name: 'MyIndex',
  data () {
    return {
      currentUser: {} // 当前登录用户信息
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    // 初始化时调用
    this.loadCurrentUser()
  },
  methods: {
    async loadCurrentUser () {
      const { data } = await getCurrentUser()
      this.currentUser = data.data
    },
    onLogout () {
      // 提示用户确认退出
      // 确认 -> 处理退出
      this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出吗？'
      }).then(() => {
        // 清除用户登录状态
        this.$store.commit('setUser', null)
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped lang="less">
  .my-container{
    .my-info{
      background-color: #6db4fd;
      .base-info{
        height: 115px;
        box-sizing: border-box;
        background-color: unset;
        padding-top: 38px;
        padding-bottom: 11px;
        .avatar{
          box-sizing: border-box;
          width: 66px;
          height: 66px;
          border: 1px solid #fff;
          margin-right: 11px;
        }
        .name{
          font-size: 15px;
          color: #fff;
        }
        .update-btn{
          height: 16px;
          font-size: 10px;
          color: #666666;
        }
      }
      .data-info{
        .data-info-item{
          height: 65px;
          color: #fff;
          .text-wrap{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .count{
              font-size: 18px;
            }
            .text{
              font-size: 11px;
            }
          }
        }
      }

      /deep/ .van-grid-item__content{
        background-color: unset;
      }
    }

    .not-login{
      height: 180px;
      background-color: #6db4fd;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      .mobile{
        width: 66px;
        height: 66px;
      }
      .text{
        font-size: 14px;
        color: #fff;
      }
    }

    /deep/ .nav-grid{
      .nav-grid-item{
        height: 70px;
        .iconfont{
          font-size: 22.5px;
        }
        .icon-shoucang{
          color: #eb5253;
        }
        .icon-lishi{
          color: #ff9d1d;
        }
        .van-grid-item__text{
          font-size: 14px;
          color: #333333;
        }
      }
    }

    .logout-btn{
      text-align: center;
      color: #d86262;
    }

    .mb-4{
      margin-bottom: 4px;
    }
  }
</style>
