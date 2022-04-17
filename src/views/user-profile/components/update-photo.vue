<template>
    <div class="update-photo">
      <img
        :src="image"
        alt=""
        ref="image"
        class="image"
      >
      <van-nav-bar
        class="toolbar"
        left-text="取消"
        right-text="确认"
        @click-left="$emit('close')"
        @click-right="onConfirm"
      />
    </div>
</template>

<script>
import { updateUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  name: 'UpdatePhoto',
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      image: window.URL.createObjectURL(this.file),
      cropper: null
    }
  },
  mounted () {
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      // autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },
  methods: {
    getCroppedCanvas () {
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob(blob => {
          resolve(blob)
        })
      })
    },
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true
      })

      const file = await this.getCroppedCanvas()

      const fd = new FormData()
      fd.append('photo', file)
      // const fd = new FormData()
      // fd.append('photo', this.file)
      await updateUserPhoto(fd)

      this.$toast.success('保存成功')

      this.$emit('update-photo', window.URL.createObjectURL(file))
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less">
  .van-nav-bar{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .image{
    display: block;
    max-width: 100%;
  }
  .toolbar{
    background-color: unset;
  }
</style>
