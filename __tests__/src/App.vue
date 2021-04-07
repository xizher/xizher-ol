<template>
<div>
  <div :id="id"></div>
  <div v-if="loaded">
    <BasemapControl />
    <BaseToolsControl />
    <MarkToolControl />
    <MeasureToolControl />
  </div>
</div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'
import {
  WebMap,
  MapCursor,
  Basemap,
  MapElementDisplay,
  MapTools,
} from '../../dist'
import BasemapControl from './components/BasemapControl.vue'
import BaseToolsControl from './components/BaseToolsControl.vue'
import MarkToolControl from './components/MarkToolControl.vue'
import MeasureToolControl from './components/MeasureToolControl.vue'
export default {
  components: {
    BasemapControl,
    BaseToolsControl,
    MarkToolControl,
    MeasureToolControl,
  },
  name: 'test',
  setup () {
    const id = 'ol-container'
    const webMap = new WebMap(id, {
      viewOptions: {
        // projection: 'EPSG:3857', // EPSG:3857 or EPSG:4326
        projection: 'EPSG:4326', // EPSG:3857 or EPSG:4326
        center: [113, 23],
        zoom: 6,
      }
    })
      .use(new Basemap())
      .use(new MapCursor())
      .use(new MapElementDisplay())
      .use(new MapTools())
    const loaded = ref(false)
    const handler = webMap.on('loaded', () => {
      window.webMap = webMap
      loaded.value = true
    })
    onMounted(() => { webMap.mount() })
    onUnmounted(() => handler.remove())
    return {
      id,
      loaded,
    }
  }
}
</script>

<style>
#ol-container {
  height: 80vh;
  width: 100vw;
}
html,
body {
  padding: 0;
  margin: 0;
}
</style>
