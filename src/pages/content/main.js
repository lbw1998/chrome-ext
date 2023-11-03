import { getItem } from '../../utils/storage'

// let timer

getItem(['proxy', 'scene', 'isRefreshToken'], function (result) {
  const proxy = result.proxy
  const scene = result.scene

  // 只设置本地开发时候的环境
  if (location.hostname === 'local.virtaicloud.com') {
    const script = document.createElement('script')
    script.innerHTML = `window.SCENE = '${scene}';window.__PUBLIC__ = window.SCENE === 'cloud';window.__PRIVATE__ = window.SCENE === 'local';`
    document.head.appendChild(script)
  }

  if (proxy && ~proxy.indexOf(location.hostname)) {
    chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
      if (request.message === 'syncStorage') {
        sendResponse({ code: 0, data: window.localStorage })
      }
    })
  }
  // if (result.isRefreshToken) {
  //   refresh()
  // }
})

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   // 在这里处理接收到的消息
//   if (request.type === 'refreshToken') {
//     const isRefreshToken = request.isRefreshToken
//     clearInterval(timer)
//     if (isRefreshToken) {
//       refresh()
//     }
//   }
// })

// const refresh = () => {
//   requestToken()
//   timer = setInterval(() => {
//     // todo 刷新token
//     requestToken()
//   }, 1000 * 60 * 5)
// }

// const requestToken = () => {
//   const refreshToken = JSON.parse(localStorage.getItem('refreshToken'))
//   if (!refreshToken) {
//     return
//   }
//   const xhr = new XMLHttpRequest()
//   xhr.open('GET', `https://${location.host}/gemini/v1/gemini_userauth/token/refresh?refreshToken=${refreshToken}`)
//   xhr.onreadystatechange = function () {
//     if (xhr.readyState === 4 && xhr.status === 200) {
//       const { data: { token } } = JSON.parse(xhr.responseText)
//       const exdate = new Date()
//       exdate.setDate(exdate.getDate() + 1)
//       document.cookie =
//       'g_token=' + token + ';domain=.virtaicloud.com;path=/;expires=' + exdate.toUTCString()
//     }
//   }
//   xhr.send()
// }
