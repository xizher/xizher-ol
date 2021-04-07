<template>
  <div>
    基础工具集：
    <button
      v-for="item in btns"
      :key="item"
      :style="{
        fontWeight: item.toolKey === activedKey ? 'bold' : 'normal'
      }"
      @click="() => activedKey = item.toolKey"
    >
      {{ item.toolKey }}
    </button>
  </div>
</template>

<script setup>
import useMapTools from '../../../dist/hooks/maptools.hooks'
const btns = [
  { toolKey: 'default' },
  { toolKey: 'zoom-in' },
  { toolKey: 'zoom-out' },
  { toolKey: 'zoom-in-rect' },
  { toolKey: 'zoom-out-rect' },
  { toolKey: 'zoom-home' },
  { toolKey: 'fullscreen' },
  { toolKey: 'fullmap' },
  { toolKey: 'clear' },
]
const [activedKey] = useMapTools(window.webMap.mapTools)
</script>

<style scoped>

</style>
