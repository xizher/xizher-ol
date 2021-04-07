<template>
  <div>
    <div>图层控制</div>
    <div
      v-for="(item, index) in layerFormatList"
      :key="item.id"
    >
      <span> - {{ item.name }}</span>
      <button @click="zoomTo(item.name)">zoom</button>
      <input
        type="checkbox"
        :checked="item.visible"
        @change="e => handleChangeVisible(e.target.checked, layerList[index])"
      >
      <input type="number" min="0" max="1" step=".1" :value="item.opacity" @change="e => changeOpacity(e, layerList[index])">
      <button @click="handleChangeLevel(item.level, item.level + 1, layerList[index])">up</button>
      <button @click="handleChangeLevel(item.level, item.level - 1, layerList[index])">down</button>
    </div>
  </div>
</template>

<script setup>
import useLayerList from '../../../dist/hooks/layer-operation.hooks'
const [layerList, layerFormatList] = useLayerList(window.webMap.layerOperation)
function handleChangeVisible (visible, item) {
  item.visible = visible
}
function handleChangeLevel (level, newLevel, item) {
  if (newLevel < 0 || newLevel >= layerList.length) {
    return
  }
  layerList.find(item => item.level === newLevel).level = level
  item.level = newLevel
}
function zoomTo (name) {
  webMap.layerOperation.zoomToLayer(name)
}
function changeOpacity (e, item) {
  item.opacity = e.target.valueAsNumber
}
</script>

<style scoped>

</style>
