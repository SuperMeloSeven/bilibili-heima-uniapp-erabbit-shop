import { createSSRApp } from 'vue'
import pinia from './stores'
import { translate } from './locale'
import i18n from './locale'

import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)

  app.use(pinia)
  app.use(i18n)

  // @ts-ignore
  app.config.globalProperties.$t = translate // 覆盖不能正常工作的$t函数
  // #ifdef MP-WEIXIN
  // 由于微信小程序的运行机制问题，需声明如下一行，H5和APP非必填
  app.config.globalProperties._i18n = i18n
  // #endif

  return {
    app,
  }
}
