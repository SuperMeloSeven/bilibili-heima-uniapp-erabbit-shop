import { useMemberStore } from '@/stores'

const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'
// const baseURL = 'https://pcapi-xiaotuxian-front.itheima.net'
// const baseURL = 'http://localhost:3000'

const httpInterceptor = {
  invoke(options: UniApp.RequestOptions) {
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }

    options.timeout = 10000
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }

    const token = useMemberStore().profile?.token
    if (token) {
      options.header.Authorization = token
    }
  },
}

uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

interface IData<T> {
  code: string
  msg: string
  result: T
}

export const http = <T>(options: UniApp.RequestOptions) => {
  return new Promise<IData<T>>((resolve, reject) => {
    uni.request({
      ...options,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as IData<T>)
        } else if (res.statusCode === 401) {
          useMemberStore().clearProfile()
          uni.navigateTo({
            url: '/pages/login/login',
          })
          reject(res)
        } else {
          uni.showToast({
            title: (res.data as IData<T>).msg || '请求失败',
            icon: 'none',
          })
          reject(res)
        }
      },
      fail(err) {
        uni.showToast({
          title: '请求失败',
          icon: 'none',
        })
        reject(err)
      },
    })
  })
}
