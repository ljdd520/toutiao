<template>
    <div class="update-name">
      <!-- 导航栏 -->
      <van-nav-bar
        title="修改昵称"
        left-text="取消"
        right-text="完成"
        @click-left="$emit('close')"
        @click-right="onConfirm"
      />

      <div class="name-field-wrap">
        <van-field
          v-model="localName"
          rows="1"
          autosize
          type="textarea"
          placeholder="请输入留言"
          maxlength="7"
          show-word-limit
        />
      </div>
    </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateName',
  data () {
    return {
      localName: this.name
    }
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true
      })
      // 请求提交更新用户昵称
      await updateUserProfile({
        name: this.localName
      })
      this.$toast.success('保存成功')

      this.$emit('update-name', this.localName)
      // 更新成功
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less">
  .name-field-wrap{
    padding: 10px;
  }
</style>
