<template>
    <div class="update-birthday">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirm"
      />
    </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateBirthday',
  props: {
    birthday: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      minDate: new Date(2000, 1, 1),
      maxDate: new Date(),
      currentDate: new Date(this.birthday)
    }
  },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true
      })

      const date = `${this.currentDate.getFullYear()}-${parseInt(this.currentDate.getMonth()) + 1}-${this.currentDate.getDate()}`

      // 请求提交更新用户昵称
      await updateUserProfile({
        birthday: date
      })

      this.$emit('update-birthday', date)
      // 更新成功
      this.$emit('close')

      this.$toast.success('保存成功')
    }
  }
}
</script>

<style scoped>

</style>
