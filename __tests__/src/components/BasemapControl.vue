<template>
  <div>
    <div>底图控制插件测试：</div>
    <div>
      <select @change="e => key = e.target.value">
        <option
          v-for="item in list"
          :key="item"
          :value="item"
          :selected="item === key"
        >
          {{ item }}
        </option>
      </select>
      <input type="checkbox" :checked="visible" @change="e => visible = e.target.checked">
    </div>
    <div>
      <select @change="e => basemap.setBasemap(e.target.value)">
        <option
          v-for="item in list"
          :key="item"
          :value="item"
          :selected="item === key"
        >
          {{ item }}
        </option>
      </select>
      <input type="checkbox" :checked="visible" @change="e => basemap.setVisible(e.target.checked)">
    </div>
  </div>
</template>

<script>
import {  } from 'vue'
import useBasemap from '../../../dist/hooks/basemap.hooks'
export default {
  name: 'BasemapControl',
  setup () {
    const [key, visible, list] = useBasemap(window.webMap.basemap)
    return {
      key,
      visible,
      list,
      basemap: window.webMap.basemap
    }
  }
}
</script>

<style scoped>

</style>
