<template>
    <div class="channel-edit">
      <van-cell
        center
        :border="false">
        <template #title>
          <div class="channel-title">我的频道</div>
        </template>
        <van-button
          type="danger"
          plain
          round
          size="mini"
          @click="isEdit =!isEdit"
        >
          {{ isEdit ? '完成' : '编辑' }}
        </van-button>
      </van-cell>

      <!--
      :class="{ active:index===active }"
       条件判断动态绑定类名
       -->
      <van-grid :gutter="10">
        <van-grid-item
          class="grid-item"
          :class="{ active:index===active }"
          :icon="(isEdit && index !==0) ? 'clear' : ''"
          v-for="(channel,index) in userChannels"
          :key="index"
          :text="channel.name"
          @click="onUserChannelClick(channel,index)"
        />
      </van-grid>

      <van-cell
        center
        :border="false">
        <template #title>
          <div class="channel-title">频道推荐</div>
        </template>
      </van-cell>

      <van-grid :gutter="10">
        <van-grid-item
          class="grid-item"
          v-for="(channel,index) in recommandChannels"
          :key="index"
          :text="channel.name"
          @click="onAdd(channel)"
        />
      </van-grid>
    </div>
</template>

<script>
import { addUserChannel, getAllChannels, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'channel-edit',
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道数据
      isEdit: false // 编辑显示的删除图标
    }
  },
  computed: {
    ...mapState(['user']),
    // 推荐的频道列表
    recommandChannels () {
      // 所有频道-我的频道=剩下的频道
      return this.allChannels.filter(channel => {
        // 找到满足该条件的元素
        return !this.userChannels.find(userChannel => {
          // 找到满足该条件的元素
          return userChannel.id === channel.id
        })
      })
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    async onAdd (channel) {
      // eslint-disable-next-line vue/no-mutating-props
      this.userChannels.push(channel)

      // 数据持久化
      if (this.user) {
        await addUserChannel({
          channels: [
            {
              id: channel.id,
              // 测试用的数据
              name: channel.name,
              seq: this.userChannels.length
            }
          ]
        })
      } else {
        setItem('user-channels', this.userChannels)
      }
    },
    onUserChannelClick (channel, index) {
      if (this.isEdit && index !== 0) {
        // 编辑状态，删除频道
        this.deleteChannel(channel, index)
      } else {
        // 非编辑状态，切换频道
        this.switchChannel(index)
      }
    },
    async deleteChannel (channel, index) {
      if (index <= this.active) {
        this.$emit('update-active', this.active - 1)
      }

      // eslint-disable-next-line vue/no-mutating-props
      this.userChannels.splice(index, 1)

      // 数据持久化
      if (this.user) {
        // 登录了持久化到线上
        await deleteUserChannel(channel.id)
      } else {
        // 没有登录，持久化到本地
        setItem('user-channels', this.userChannels)
      }
    },
    switchChannel (index) {
      // 切换标签
      this.$emit('update-active', index)
      // 关闭弹出层
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less">
  .channel-edit{

    /deep/ .van-cell__value{
      display: flex;
      justify-content: flex-end;
    }

    padding-top: 54px;
    .channel-title{
      font-size: 16px;
      color: #333333;
    }

    .grid-item{
      width: 80px;
      height: 43px;
      /deep/ .van-grid-item__content{
        background-color: #f4f5f6;
        .van-grid-item__text{
          font-size: 14px;
          color: #222;
          /* 形成挤压 */
          margin-top: 0;
        }
      }

      /deep/ .van-grid-item__icon{
        position: absolute;
        font-size: 20px;
        color: #ccc;
        right: -10px;
        top: -10px;
      }
    }

    .active{
      /deep/ .van-grid-item__text{
        color: red !important;
      }
    }

    /deep/ .van-button{
      flex: 0.5;
    }
  }
</style>
