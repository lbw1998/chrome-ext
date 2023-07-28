const renderJiraButton = () => {
  const ele = document.createElement('div')
  ele.style.top = '60px'
  ele.style.right = '40px'
  ele.style.padding = '5px 12px'
  ele.style.position = 'absolute'
  ele.style.zIndex = '9999'
  ele.style.color = '#fff'
  ele.style.background = '#4c7dff'
  ele.style.borderRadius = '4px'
  ele.style.cursor = 'pointer'
  ele.style.boxShadow = '#4c7dff 0px 5px 15px'
  ele.innerHTML = '复制到Confluence'
  ele.onclick = copyJira
  document.body.appendChild(ele)
}

const $ = id => {
  return document.getElementById(id)?.innerText.trim()
}
const getCreateTime = () => {
  const date = new Date(document.getElementById('created-val').children[0].getAttribute('datetime'))
  const y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  return y + '-' + m + '-' + d
}

const copyJira = () => {
  const vp = $('key-val')
  const name = $('summary-val')
  const time = getCreateTime()
  const reporter = $('reporter-val')
  const assignee = $('assignee-val')
  const versions = $('versions-field')
  const fixVersions = $('fixVersions-field')
  const isEasyBug = $('wrap-labels').includes('一眼bug') ? '是' : '否'
  const isRegressionBug = $('wrap-labels').includes('regression_bug') ? '是' : '否'

  // copy(vp, name, time, reporter, assignee, versions, fixVersions, isEasyBug, isRegressionBug)
  const arr = [
    vp, name, time, reporter, assignee, versions, fixVersions, isEasyBug, isRegressionBug
  ]

  // 将数据转换为 HTML 表格
  const table = document.createElement('table')
  const row = document.createElement('tr')
  const a = document.createElement('a')
  a.href = location.href
  a.target = '_blank'
  a.textContent = arr[0]
  const cell = document.createElement('td')
  cell.appendChild(a)
  row.appendChild(cell)
  for (let i = 1; i < arr.length; i++) {
    const rowData = arr[i]
    const cell = document.createElement('td')
    cell.textContent = rowData
    row.appendChild(cell)
  }
  table.appendChild(row)

  // 将表格添加到文档中
  document.body.appendChild(table)
  window.getSelection().empty()
  // 将表格复制到剪贴板中
  const range = document.createRange()
  range.selectNode(table)
  window.getSelection().addRange(range)
  document.execCommand('copy')

  // 删除表格元素
  document.body.removeChild(table)
  chrome.runtime.sendMessage({
    type: 'copyJira'
  })
}

document.addEventListener('DOMContentLoaded', (event) => {
  renderJiraButton()
})
