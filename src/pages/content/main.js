// import { getItem } from '../../utils/storage'

// let timer

// getItem(['proxy', 'isRefreshToken'], function (result) {
//   const proxy = result.proxy
//   if (proxy && proxy === location.hostname) {
//     chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
//       if (request.message === 'syncStorage') {
//         sendResponse({ code: 0, data: window.localStorage })
//       }
//     })
//   }
//   if (result.isRefreshToken) {
//     refresh()
//   }
// })

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
