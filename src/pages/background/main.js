/* eslint-disable no-undef */
import { getItem, setItem } from '../../utils/storage'
import { PROXY, PROXY_LIST, SCENE, IS_REFRESH_TOKEN, SUFFIX, PORT } from '../../utils/constant'

let timer // 存放定时器
let proxy = PROXY
let scene = SCENE
const proxyList = PROXY_LIST
const isRefreshToken = IS_REFRESH_TOKEN

getItem(['proxyList', 'scene', 'proxy'], function (result) {
  scene = result.scene
  if (!result.proxyList) {
    init()
  } else {
    proxy = result.proxy
  }
})

const init = () => {
  setItem({ proxy, proxyList, scene, isRefreshToken })
}

const getCookies = () => {
  chrome.cookies.getAll({ domain: '.virtaicloud.com' }, function (cookies) {
    cookieHeader = ''
    for (const i in cookies) {
      if (cookies[i].domain === '.virtaicloud.com') {
        if (cookies[i].name === 'g_token') {
          cookieHeader = cookies[i].name + '=' + cookies[i].value + '; '
        }
      }
    }
  })
}

let cookieHeader = ''
getCookies()

// iframe请求添加cookies
chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    if (scene === 'local') {
      return {}
    }
    // 判断当前请求是否来自iframe页面
    if (details.type === 'xmlhttprequest') {
      const regx = /.virtaicloud.com:\d+\/gemini\/v1/
      if (regx.test(details.url)) {
        for (let i = 0; i < details.requestHeaders.length; ++i) {
          if (details.requestHeaders[i].name === 'Cookie') {
            break
          }
        }

        // 修改请求头部信息中的Cookie字段
        details.requestHeaders.push({
          name: 'Cookie',
          value: cookieHeader
        })
      }
    }
    return { requestHeaders: details.requestHeaders }
  },
  { urls: ['https://*.virtaicloud.com:*/gemini/v1/*'] },
  ['blocking', 'requestHeaders', 'extraHeaders']
)

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const url = details.url
    const regx = /local.virtaicloud.com:\d+(\/gemini_web)?\/gemini\/v1/
    // 匹配需要替换的URL
    if (regx.test(url)) {
      // 构建新的URL地址
      const newUrl = url.replace(regx, proxy + ':' + PORT + SUFFIX)
      // 返回修改后的URL信息
      return { redirectUrl: newUrl }
    }
  },
  { urls: ['https://*.virtaicloud.com:*/gemini/v1/*', 'https://*.virtaicloud.com:*/gemini_web/gemini/v1/*'] },
  ['blocking']
)

// 更新cookie
chrome.cookies.onChanged.addListener(
  (details) => {
    if (details.cookie.name === 'g_token') {
      cookieHeader = 'g_token=' + details.cookie.value + '; '
    }
  }
)

// 在background.js中监听消息并更新事件
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'changeProxy') {
    getItem(['proxy'], function (result) {
      if (result.proxy) {
        proxy = result.proxy
      }
    })
  } else if (message.type === 'copyJira') {
    openJira()
  }
})

// 打开jira标签页并点击编辑
const openJira = () => {
  let newTab
  const clickEdit = (tabId, changeInfo, tab) => {
    if (tabId === newTab.id && changeInfo.status === 'complete') {
      chrome.tabs.executeScript(
        tabId,
        { code: 'document.getElementById(\'editPageLink\').click()' })
      chrome.tabs.onUpdated.removeListener(clickEdit)
    }
  }

  chrome.tabs.create({ url: 'http://confluence.virtaitech.com/pages/viewpage.action?pageId=70059794' }, tab => {
    newTab = tab
    chrome.tabs.onUpdated.addListener(clickEdit)
  })
}

// 自动刷新
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // 在这里处理接收到的消息
  if (request.type === 'refreshToken') {
    const isRefreshToken = request.isRefreshToken
    clearInterval(timer)
    if (isRefreshToken) {
      refresh()
    }
  }
})

const refresh = () => {
  requestToken()
  timer = setInterval(() => {
    // todo 刷新token
    requestToken()
  }, 1000 * 60 * 5)
}

const requestToken = () => {
  const refreshToken = JSON.parse(localStorage.getItem('refreshToken'))
  if (!refreshToken) {
    return
  }
  const xhr = new XMLHttpRequest()
  xhr.open('GET', `https://${proxy}:31443/gemini/v1/gemini_userauth/token/refresh?refreshToken=${refreshToken}`)
  xhr.send()
}
