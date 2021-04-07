import { onUnmounted, reactive, Ref, ref, watch } from 'vue'
import { baseUtils } from '@xizher/js-utils'
import BaseTool from '../plugins/map-tools/base-tool'
import { MapTools } from '../plugins/map-tools/map-tools'

/**
 * 地图工具链钩子
 * @param mapTools 地图工具链插件对象
 * @param toolKeys 当前激活的工具对应Key值
 */
function useMapTools (mapTools: MapTools, toolKeys: string[] = []) : [Ref<string>, string[]] {
  const activedKey = ref(mapTools.activedKey)
  watch(activedKey, k => (k !== mapTools.activedKey) && mapTools.setMapTool(k))
  mapTools.on('change', e => activedKey.value = e.currentKey)
  const list = reactive(toolKeys)
  return [activedKey, list]
}

export default useMapTools

/**
 * 创建自定义工具方法钩子
 * @param mapTools 地图工具链插件对象
 * @param toolObject 工具对象
 * @param toolKey 工具Key值，默认生成GUID
 */
export function useCreateTool (mapTools: MapTools, toolObject: BaseTool<unknown>, toolKey?: string)
  : [() => void, () => void, string] {
  const key = toolKey ?? baseUtils.createGuid()
  mapTools.createCustomTool(key, toolObject)
  onUnmounted(() => mapTools.deleteTool(key))
  const active = () => mapTools.setMapTool(key)
  const deactive = () => mapTools.setMapTool('default')
  return [active, deactive, key]
}
