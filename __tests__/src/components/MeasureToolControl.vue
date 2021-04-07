<template>
  <div>
    测量工具：
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
    <button @click="clearMeasure">
      清空信息
    </button>
    <button
      :style="{
        fontWeight: removeToolActived ? 'bold' : 'normal'
      }"
      @click="removeToolActived = true"
    >
      移除指定测量信息
    </button>
  </div>
</template>

<script setup>
import useMeasureTool from '../../../dist/hooks/measure-tool.hooks'
const [selectedType, typeList, enabled, clearMeasure, removeToolActived] = useMeasureTool(window.webMap.mapTools)
</script>

<style scoped>

</style>
