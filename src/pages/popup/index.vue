<template>
  <div>
    <h3>环境代理</h3>
    <div class="item">
      <label>当前环境：</label>
      <a-select
        v-model:value="scene"
        size="small"
        :options="sceneList"
        @change="sceneChange"
      >
      </a-select>
    </div>
    <div class="item">
      <label>代理地址：</label>
      <a-select
        ref="select"
        v-model:value="proxy"
        style="width: 80px"
        :listHeight="180"
        size="small"
        :options="proxyList"
        @change="proxyChange"
      ></a-select>
      .virtaicloud.com
    </div>
    <h3>其他操作</h3>
    <div class="item">
      <label>同步Storage：</label>
      <a-button type="primary" @click="syncStorage">开始同步</a-button>
    </div>
    <!-- <div class="item">
      <label>
        自动刷新token:
      </label>
      <a-switch v-model:checked="isRefreshToken" @change="refreshChange" checked-children="开" un-checked-children="关" />
    </div> -->
    <a-button class="btn" type="link" href="options.html" target="_blank">配置管理</a-button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { setItem, getItem } from '../../utils/storage'
import { Button as AButton, Select as ASelect, Switch as ASwitch, message } from 'ant-design-vue'

const proxy = ref('')
const scene = ref('')
const allProxyList = ref([])
const sceneList = ref([
  {
    label: '公有云',
    value: 'cloud'
  },
  {
    label: '私有云',
    value: 'local'
  }
])
const isRefreshToken = ref(false)

const proxyList = computed(() => {
  return allProxyList.value.filter(i => i.scene === scene.value)
})

const getStorage = () => {
  getItem(['proxy', 'proxyList', 'scene', 'isRefreshToken'], function (result) {
    console.log({ result })
    proxy.value = result.proxy
    scene.value = result.scene
    isRefreshToken.value = result.isRefreshToken
    allProxyList.value = result.proxyList
  })
}

// 刷新当前页面
const refreshCurrentPage = () => {
  // 获取当前选项卡ID
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabId = tabs[0].id
    // 刷新当前选项卡
    chrome.tabs.reload(tabId)
  })
}

const proxyChange = (proxy) => {
  setItem({ proxy }, () => {
    chrome.runtime.sendMessage({ type: 'changeProxy' })
    refreshCurrentPage()
  })
}

const sceneChange = (scene) => {
  setItem({ scene }, () => {
    // 发送消息到 background 页面
    chrome.runtime.sendMessage({ type: 'refreshData' })

    proxy.value = proxyList.value[0].value
    proxyChange(proxyList.value[0].value)
  })
}

const refreshChange = (isRefreshToken) => {
  setItem({ isRefreshToken }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'refreshToken', isRefreshToken })
    })
  })
}

const syncStorage = () => {
  chrome.tabs.create({ url: 'https://' + proxy.value, active: false }, newTab => {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      if (tabId === newTab.id && changeInfo.status === 'complete') {
        // 在这里添加回调函数的代码
        chrome.tabs.sendMessage(tabId, { message: 'syncStorage' }, function (response) {
          if (response?.code === 0) {
            const storage = response.data
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
              for (const key in storage) {
                if (Object.hasOwnProperty.call(storage, key)) {
                  const item = storage[key]
                  chrome.tabs.executeScript(
                    tabs[0].id,
                    { code: `localStorage.setItem("${key}", JSON.stringify(${item}));` })
                }
              }
              chrome.tabs.remove(tabId)
              message.success('同步成功')
            })
          }
        })
      }
    })
  })
}

getStorage()
</script>

<style>
#app {
  padding: 0 10px 10px 10px;
  width: 320px;
}

.item {
  margin-bottom: 8px;
}

.item:last-of-type {
  margin-bottom: 0;
}

.item label {
  display: inline-block;
  width: 90px;
}
.btn {
  padding: 0;
  margin-bottom: 8px;
  float: right;
}
</style>
