<template>
  <div id="app">
    <!-- 路由的出口 -->
<!--    <router-view/>-->
    <router-view v-slot="{ Component }">
      <keep-alive :include="cachePages">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapState(['cachePages'])
  }
}
</script>
<style lang="less">
</style>
