export const SCENE = 'cloud'
export const SUFFIX = '/gemini/v1'
export const PORT = '31443' // 后端接口端口号
export const BASE_URL = 'local.virtaicloud.com:31443'
export const PROXY = 'dev4.virtaicloud.com'
export const PROXY_LIST = [
  {
    label: 'dev0',
    scene: 'cloud',
    value: 'dev0.virtaicloud.com:31443'
  },
  {
    label: 'dev1',
    scene: 'local',
    value: 'dev1.virtaicloud.com:31443'
  },
  {
    label: 'dev11',
    scene: 'local',
    value: 'dev11.virtaicloud.com:31443'
  },
  {
    label: 'dev21',
    scene: 'cloud',
    value: 'dev21.virtaicloud.com:31443'
  },
  {
    label: 'dev4',
    scene: 'cloud',
    value: 'platform-dev4.virtaicloud.com'
  },
  {
    label: 'dev7',
    scene: 'cloud',
    value: 'dev7.virtaicloud.com:31443'
  },
  {
    label: 'test0',
    scene: 'cloud',
    value: 'test0.virtaicloud.com:31443'
  },
  {
    label: 'test1',
    scene: 'local',
    value: 'test1.virtaicloud.com:31443'
  },
  {
    label: 'test2',
    scene: 'cloud',
    value: 'platform-test2.virtaicloud.com'
  },
  {
    label: 'test3',
    scene: 'cloud',
    value: 'platform-test3.virtaicloud.com'
  },
  {
    label: 'test4',
    scene: 'local',
    value: 'test4.virtaicloud.com:31443'
  },
  {
    label: 'mul',
    scene: 'cloud',
    value: 'platform-mul.virtaicloud.com'
  }
]
export const IS_REFRESH_TOKEN = false
