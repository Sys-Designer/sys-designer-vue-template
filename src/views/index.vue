<template>
  <n-space vertical>
    <n-button type="primary" @click="showMsg">弹出消息</n-button>
    <n-input v-model:value="inputVal"/>
    <n-select v-model:value="selectVal" :options="options" placeholder="下拉选择" />
  </n-space>
</template>

<script setup lang="ts">

const inputVal = ref('')
const selectVal = ref('')
const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' }
]
const message = useMessage();

const showMsg = () => {
  message.success('NaiveUI + Vue3 + TS + Vite 搭建成功！')
}

</script>