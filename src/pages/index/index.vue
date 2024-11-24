<script setup lang="ts">
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import type { XtxGuessInstance } from '@/types/component'
import { ref, nextTick } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '../../services/home'
import CustomNavbar from './components/CustomNavbar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import PageSkeleton from './components/PageSkeleton.vue'

// #ifdef MP-WEIXIN
import { setTabBarAndTitle } from '@/locale'
// #endif

const bannerList = ref<BannerItem[]>([])
const getBannerList = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}

const categoryList = ref<CategoryItem[]>([])
const getCategoryList = async () => {
  const res = await getHomeCategoryAPI()
  categoryList.value = res.result
}

const hotList = ref<HotItem[]>([])
const getHomeHotList = async () => {
  const res = await getHomeHotAPI()
  hotList.value = res.result
}

const getData = async () => {
  await Promise.all([getBannerList(), getCategoryList(), getHomeHotList()])
}

const isLoading = ref(false)
onLoad(async () => {
  isLoading.value = true
  await getData()
  isLoading.value = false
})

const onScrolltolower = () => {
  XtxGuessRef.value?.getMore()
}
const XtxGuessRef = ref<XtxGuessInstance>()

const isRefreshFlag = ref(false)
const onRefresh = async () => {
  isRefreshFlag.value = true
  XtxGuessRef.value?.reset()
  await getData()
  await XtxGuessRef.value?.getMore()
  isRefreshFlag.value = false
}

onShow(() => {
  // #ifdef MP-WEIXIN
  nextTick(() => {
    setTabBarAndTitle()
  })
  // #endif
})
</script>

<template>
  <CustomNavbar />
  <scroll-view
    refresher-enabled
    scroll-y
    :refresher-triggered="isRefreshFlag"
    class="scroll-view"
    @scrolltolower="onScrolltolower"
    @refresherrefresh="onRefresh"
  >
    <PageSkeleton v-if="isLoading" />
    <template v-else>
      <XtxSwiper :list="bannerList" />
      <CategoryPanel :list="categoryList" />
      <HotPanel :list="hotList" />
      <XtxGuess ref="XtxGuessRef" />
    </template>
  </scroll-view>
</template>

<style lang="scss">
/* APP端没有page标签而是在 <div id="app"></div> 标签中 */
/* #ifdef APP-PLUS */
#app,
/* #endif */
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
}
</style>
