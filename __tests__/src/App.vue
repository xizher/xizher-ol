<template>
<div>
  <div :id="id"></div>
  <div v-if="loaded">
    <BasemapControl />
    <BaseToolsControl />
    <MarkToolControl />
    <MeasureToolControl />
    <LayerOperationControl />
    <ToolBoxControl />
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
  LayerOperation,
} from '../../dist'
import BasemapControl from './components/BasemapControl.vue'
import BaseToolsControl from './components/BaseToolsControl.vue'
import MarkToolControl from './components/MarkToolControl.vue'
import MeasureToolControl from './components/MeasureToolControl.vue'
import LayerOperationControl from './components/LayerOperationControl.vue'
import ToolBoxControl from './components/ToolBoxControl.vue'
export default {
  components: {
    BasemapControl,
    BaseToolsControl,
    MarkToolControl,
    MeasureToolControl,
    LayerOperationControl,
    ToolBoxControl,
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
      },
      debug: true
    })
      .use(new Basemap())
      .use(new MapCursor())
      .use(new MapElementDisplay())
      .use(new MapTools())
      .use(new LayerOperation({
        layerItems: [
          {
            name: '广州区县级行政区划/wms',
            type: 'wms',
            url: 'http://wuxizhe.fun:8080/geoserver/webgis-ol-base/wms',
            params: {
              'FORMAT': 'image/png',
              'VERSION': '1.1.1',
              'tiled': true,
              'STYLES': '',
              'LAYERS': 'webgis-ol-base:boundary',
              'exceptions': 'application/vnd.ogc.se_inimage'
            },
            visible: true
          }, {
            name: '广州区县级行政区划',
            type: 'wfs',
            url: 'http://wuxizhe.fun:8080/geoserver/webgis-ol-base/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis-ol-base:boundary&outputFormat=application/json',
            visible: false
          }, {
            name: '广佛地铁线路',
            type: 'wfs',
            url: 'http://wuxizhe.fun:8080/geoserver/webgis-ol-base/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis-ol-base:subway&outputFormat=application/json',
            visible: true,
          }, {
            name: '广佛地铁站点',
            type: 'wfs',
            url: 'http://wuxizhe.fun:8080/geoserver/webgis-ol-base/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis-ol-base:stations&outputFormat=application/json',
            visible: true,
            style: {
              image: {
                styleType: 'circle',
                fill: { color: '#000000' },
                radius: 2
              }
            }
          },
        ]
      }))
    const loaded = ref(false)
    const handler = webMap.on('loaded', () => {
      console.log('webMap loaded')
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
