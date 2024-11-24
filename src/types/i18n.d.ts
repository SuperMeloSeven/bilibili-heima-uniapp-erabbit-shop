/* eslint-disable no-unused-vars */
export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: (key: string, opt?: Record<string, any>) => string
    // $tm: (key: string, opt?: Record<string, any>) => [] | { [p: string]: any }
  }
}

declare global {
  function $t(localeKey: string, opt?: Record<string, any>): string
}
