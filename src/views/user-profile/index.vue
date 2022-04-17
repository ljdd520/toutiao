<template>
    <div class="user-profile">
      <!-- 顶部导航栏 -->
      <van-nav-bar
        class="app-nav-bar"
        title="个人信息"
        left-arrow
        @click-left="this.$router.back()"
      />

      <input
        type="file"
        hidden
        accept="image/*"
        ref="file"
        @change="onFileChange"
      >
      <van-cell
        title="头像"
        is-link
        center
        @click="$refs.file.click()"
      >
        <van-image
          width="44"
          height="44"
          round
          fit="cover"
          :src="user.photo"
        />
      </van-cell>
      <van-cell
        title="昵称"
        is-link
        :value="user.name"
        @click="isEditNameShow=true"
      />
      <van-cell
        title="性别"
        is-link
        :value="user.gender===0 ? '男' : '女'"
        @click="isEditGenderShow=true"
      />
      <van-cell
        title="生日"
        is-link
        :value="user.birthday"
        @click="isEditBirthdayShow=true"
      />

      <!-- 修改信息的弹出层 -->
      <van-popup
        v-model:show="isEditNameShow"
        position="bottom"
        :style="{height: '100%'}"
      >
        <update-name
          v-if="isEditNameShow"
          :name="user.name"
          @update-name="user.name=$event"
          @close="isEditNameShow=false"
        />
      </van-popup>

      <!-- 修改性别 -->
      <van-popup
        v-model:show="isEditGenderShow"
        position="bottom"
      >
        <!--
          :gender="user.gender"
          @update-gender="user.gender=$event"
        -->
        <update-gender
          :gender="user.gender"
          @update-gender="user.gender=$event"
          @close="isEditGenderShow=false"
        />
      </van-popup>

      <!-- 修改生日 -->
      <van-popup
        v-model:show="isEditBirthdayShow"
        position="bottom"
      >
        <update-birthday
          v-if="isEditBirthdayShow"
          :birthday="user.birthday"
          @update-birthday="user.birthday=$event"
          @close="isEditBirthdayShow=false"
        />
      </van-popup>

      <!-- 修改头像 -->
      <van-popup
        v-model:show="isEditPhotoShow"
        position="bottom"
        style="height: 100%"
        class="update-photo-popup"
      >
        <update-photo
          v-if="isEditPhotoShow"
          :file="previewImage"
          @close="isEditPhotoShow=false"
          @update-photo="user.photo=$event"
        />
      </van-popup>
    </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'

export default {
  name: 'UserIndex',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  props: {},
  data () {
    return {
      user: {}, // 用户数据
      isEditNameShow: false,
      isEditGenderShow: false,
      isEditBirthdayShow: false,
      isEditPhotoShow: false,
      previewImage: null
    }
  },
  computed: {},
  created () {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.user = data.data
    },
    onFileChange () {
      // const blob = window.URL.createObjectURL(this.$refs.file.files[0])
      // this.previewImage = blob
      const file = this.$refs.file.files[0]
      this.previewImage = file

      this.isEditPhotoShow = true

      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
  /deep/ .van-popup{
    background-color: #f5f7f9 !important;
  }
  /deep/ .update-photo-popup{
    background-color: #000 !important;
  }
</style>
