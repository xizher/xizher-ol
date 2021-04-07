<template>
  <div>
    标记工具：
    <button
      v-for="item in typeList"
      :key="item.name"
      :style="{
        fontWeight: (item.name === selectedType && enabled) ? 'bold' : 'normal'
      }"
      @click="selectedType = item.name"
    >
      {{ item.alias }}
    </button>
    <button @click="clearMark">
      清空标注
    </button>
    <button
      :style="{
        fontWeight: removeToolActived ? 'bold' : 'normal'
      }"
      @click="removeToolActived = true"
    >
      移除指定标注
    </button>
  </div>
</template>

<script setup>
import useMarkTool from '../../../dist/hooks/mark-tool.hooks'
const [selectedType, typeList, enabled, clearMark, removeToolActived] = useMarkTool(window.webMap.mapTools)
</script>

<style scoped>

</style>
