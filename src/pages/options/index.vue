<template>
  <div class="options-wrap">
    <h1>设置</h1>
    <h3 class="title">
      代理地址
      <a-button type="primary" @click="visible = true">添加</a-button>
    </h3>
    <a-table bordered :columns="columns" :dataSource="proxyList">
      <template #bodyCell="{ column, index, record }">
        <div v-if="column.dataIndex === 'action'">
          <a-popconfirm
            title="确定删除吗?"
            :disabled="proxy === record.value"
            ok-text="是"
            cancel-text="否"
            @confirm="del(index)"
          >
            <a-button :disabled="proxy === record.value" type="link">删除</a-button>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
    <a-modal v-model:visible="visible" :footer="null">
      <a-form
        :model="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 16 }"
        labelAlign="left"
        style="margin-top: 36px;"
        @finish="addProxy"
      >
        <a-form-item
          label="代理地址"
          name="value"
          :rules="[{ required: true, message: '请输入代理地址' }]"
        >
          <a-input v-model:value="form.value" />
        </a-form-item>

        <a-form-item
          label="简称"
          name="label"
          :rules="[{ required: true, message: '请输入简称' }]"
        >
          <a-input v-model:value="form.label" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 20, span: 4 }" style="margin-bottom: -20px;">
          <a-button type="primary" html-type="submit">新增</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getItem, setItem } from '../../utils/storage'
import { Table as ATable, Button as AButton, Modal as AModal, Form as AForm, FormItem as AFormItem, Input as AInput, Popconfirm as APopconfirm, message } from 'ant-design-vue'

const columns = [
  {
    title: '代理地址',
    dataIndex: 'value',
    key: 'value'
  },
  {
    title: '简称',
    dataIndex: 'label',
    key: 'label'
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action'
  }
]

const proxy = ref('')
const proxyList = ref([])
const visible = ref(false)
const form = ref({
  label: '',
  value: ''
})

const addProxy = data => {
  const cloneList = JSON.parse(JSON.stringify(proxyList.value))
  cloneList.unshift(data)
  setItem({ proxyList: cloneList })
  proxyList.value = cloneList
  message.success('添加成功')
  form.value = {
    label: '',
    value: ''
  }
  visible.value = false
}

const del = index => {
  const cloneList = JSON.parse(JSON.stringify(proxyList.value))
  cloneList.splice(index, 1)
  proxyList.value = cloneList
  setItem({ proxyList: cloneList })
}

getItem(['proxy', 'proxyList'], function (result) {
  proxy.value = result.proxy
  proxyList.value = result.proxyList
})

</script>

<style>
.options-wrap {
  width: 1200px;
  margin: 0 auto;
}
.title {
  display: flex;
  justify-content: space-between;
}
</style>
