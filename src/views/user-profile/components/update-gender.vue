<template>
    <div class="update-gender">
      <van-picker
        :columns="columns"
        @cancel="$emit('close')"
        @confirm="onConfirm"
        :default-index="defaultIndex"
        @change="onGenderChange"
      />
    </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateGender',
  data () {
    return {
      columns: ['男', '女'],
      defaultIndex: this.gender
    }
  },
  props: {
    gender: {
      type: Number,
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
        gender: this.defaultIndex
      })

      this.$emit('update-gender', this.defaultIndex)
      // 更新成功
      this.$emit('close')

      this.$toast.success('保存成功')
    },
    onGenderChange (value, index) {
      this.defaultIndex = index
    }
  }
}
</script>

<style scoped lang="less">

</style>
