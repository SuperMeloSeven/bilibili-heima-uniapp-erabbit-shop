<script setup lang="ts">
import type { SubTypeItem } from '@/types/hot'
import type { PageResult } from '@/types/global'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getHotRecommendAPI } from '@/services/hot'

// 热门推荐页 标题和url
const hotMap = [
  { type: '1', title: '特惠推荐', url: '/hot/preference' },
  { type: '2', title: '爆款推荐', url: '/hot/inVogue' },
  { type: '3', title: '一站买全', url: '/hot/oneStop' },
  { type: '4', title: '新鲜好物', url: '/hot/new' },
]

const currUrlMap = ref({
  type: '',
  url: '',
  title: '',
})
const bannerPicture = ref('')
const subTypes = ref<SubTypeItem[]>([])
const activeIndex = ref(0)

type TParams = Pick<PageResult<any>, 'page' | 'pageSize'> & {
  subType: string
}

const getHotRecommendData = async (params?: TParams) => {
  const res = await getHotRecommendAPI(currUrlMap.value.url, {
    subType: params?.subType || '',
    page: params?.page || (import.meta.env.DEV ? 30 : 1),
    pageSize: params?.pageSize || 10,
  })

  if (params) {
    const newSubTypes = res.result.subTypes[activeIndex.value]
    if (newSubTypes.goodsItems.items) {
      subTypes.value[activeIndex.value].goodsItems.items?.push(...newSubTypes.goodsItems.items)
    }
  } else {
    bannerPicture.value = res.result.bannerPicture
    subTypes.value = res.result.subTypes
  }
}

const onScrolltolower = () => {
  const curr = subTypes.value[activeIndex.value]

  if (curr.goodsItems.page < curr.goodsItems.pages) {
    curr.goodsItems.page++
  } else {
    return uni.showToast({
      title: '没有更多数据了',
      icon: 'none',
    })
  }

  getHotRecommendData({
    subType: curr.id,
    page: curr.goodsItems.page,
    pageSize: curr.goodsItems.pageSize,
  })
}

onLoad((options) => {
  currUrlMap.value = hotMap.find((item) => item.type === options!.type)!
  uni.setNavigationBarTitle({
    title: currUrlMap.value.title,
  })

  getHotRecommendData()
})
</script>

<template>
  <view class="viewport">
    <!-- 推荐封面图 -->
    <view class="cover">
      <image :src="bannerPicture"></image>
    </view>
    <!-- 推荐选项 -->
    <view class="tabs">
      <text
        v-for="(item, index) in subTypes"
        :key="item.id"
        class="text"
        :class="{
          active: index === activeIndex,
        }"
        @tap="activeIndex = index"
        >{{ item.title }}</text
      >
    </view>
    <!-- 推荐列表 -->
    <scroll-view
      v-for="(item, index) in subTypes"
      :key="item.id"
      v-show="activeIndex === index"
      scroll-y
      class="scroll-view"
      @scrolltolower="onScrolltolower"
    >
      <view class="goods">
        <navigator
          hover-class="none"
          class="navigator"
          v-for="goods in item.goodsItems.items"
          :key="goods.id"
          :url="`/pages/goods/goods?id=${goods.id}`"
        >
          <image class="thumb" :src="goods.picture"></image>
          <view class="name ellipsis">{{ goods.desc }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ goods.price }}</text>
          </view>
        </navigator>
      </view>
      <view class="loading-text">{{
        item.goodsItems.page < item.goodsItems.pages ? '正在加载中...' : '没有更多数据了'
      }}</view>
    </scroll-view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  background-color: #f4f4f4;
}
.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 180rpx 0 0;
  position: relative;
}
.cover {
  width: 750rpx;
  height: 225rpx;
  border-radius: 0 0 40rpx 40rpx;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
}
.scroll-view {
  flex: 1;
}
.tabs {
  display: flex;
  justify-content: space-evenly;
  height: 100rpx;
  line-height: 90rpx;
  margin: 0 20rpx;
  font-size: 28rpx;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 5rpx rgba(200, 200, 200, 0.3);
  color: #333;
  background-color: #fff;
  position: relative;
  z-index: 9;
  .text {
    margin: 0 20rpx;
    position: relative;
  }
  .active {
    &::after {
      content: '';
      width: 40rpx;
      height: 4rpx;
      transform: translate(-50%);
      background-color: #27ba9b;
      position: absolute;
      left: 50%;
      bottom: 24rpx;
    }
  }
}
.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx 20rpx;
  .navigator {
    width: 345rpx;
    padding: 20rpx;
    margin-top: 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }
  .thumb {
    width: 305rpx;
    height: 305rpx;
  }
  .name {
    height: 88rpx;
    font-size: 26rpx;
  }
  .price {
    line-height: 1;
    color: #cf4444;
    font-size: 30rpx;
  }
  .symbol {
    font-size: 70%;
  }
  .decimal {
    font-size: 70%;
  }
}

.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0 50rpx;
}
</style>
