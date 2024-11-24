import { createI18n } from 'vue-i18n' // v9.x
import en from './en.json'
import zhHans from './zh-Hans.json'

const messages = {
  en,
  'zh-Hans': zhHans,
}

const i18nConfig = {
  locale: uni.getLocale(), // 获取已设置的语言
  messages,
  legacy: false, // vue3一定要将legacy设置为false，意思为声明为组合式API
  // globalInjection: true, // 全局注入 $t 函数
}

const i18n = createI18n(i18nConfig)

/**
 * 任意文件使用$t翻译方法，需要在app里全局导入
 * @param { string } localeKey 多语言的key，eg: "app.name"
 */
export const translate = (localeKey: string, opt: Record<string, any> = {}) => {
  if (!localeKey) {
    console.error(`[i18n] Function translate(), localeKey param is required`)
    return ''
  }
  const locale = uni.getLocale()

  // @ts-ignore
  const message = messages[locale]
  if (Object.keys(message).includes(localeKey)) {
    const template = message[localeKey]
    // 使用 Object.keys 遍历 params 对象，替换模板中的大括号占位符
    return Object.keys(opt).reduce(
      (acc, key) => acc.replace(new RegExp(`{${key}}`, 'g'), opt[key]),
      template,
    )
  }
  return localeKey // 转换不了则原样输出
}

/**
 * 安装到全局，覆盖不能正常工作的$t
 */
const installGlobal = () => {
  ;(function (global) {
    console.log('install i18n global')
    ;(global as any).$t = translate
  })(this || window || globalThis)
}
installGlobal()

export const initLocale = () => {
  const savedLocale = uni.getStorageSync('storage-locale')
  // 有些代码在语言切换前执行，需要提前初始化语言。对于页面模板模式
  if (savedLocale && savedLocale > '') {
    i18n.global.locale.value = savedLocale
  }
}
initLocale()

export type LocaleType = 'en' | 'zh-Hant' | 'zh-Hans'
const langMapper: Record<string, string> = {
  'zh-Hans': 'zh-CN',
  en: 'en-US',
  // 'zh-Hant': 'zh-TW',
}
export const getLocale = () => i18n.global.locale.value

export const getRequestLocale = () => langMapper[i18n.global.locale.value]

export const setLocale = async (locale: LocaleType) => {
  // await API.tools.locale.request({ lang: langMapper[locale] })
  uni.setStorageSync('storage-locale', locale)
  uni.setLocale(locale)
  i18n.global.locale.value = locale
  installGlobal() // 全局的语言重读取，这样就能统一
}

export const setTabBarAndTitle = (page = 'tabBar.home') => {
  i18n.global.locale.value = uni.getLocale()

  uni.setNavigationBarTitle({
    title: $t(`${page}`),
  })

  if (page.includes('tabBar')) {
    uni.setTabBarItem({
      index: 0,
      text: $t('tabBar.home'),
    })
    uni.setTabBarItem({
      index: 1,
      text: $t('tabBar.category'),
    })
    uni.setTabBarItem({
      index: 2,
      text: $t('tabBar.cart'),
    })
    uni.setTabBarItem({
      index: 3,
      text: $t('tabBar.mine'),
    })
  }
}

export default i18n
