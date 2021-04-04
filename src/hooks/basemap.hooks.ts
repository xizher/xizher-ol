import Basemap from '../plugins/basemap/basemap'
import { ref, Ref, watch } from 'vue'

/** 底图控制Key值钩子 */
export function useKey (basemap: Basemap) : Ref<string> {
  const key = ref(basemap.key)
  watch(key, k => k !== basemap.key && basemap.setBasemap(k))
  basemap.on('change:key', e => key.value = e.key)
  return key
}

/** 底图控制可见性钩子 */
export function useVisible (basemap: Basemap) : Ref<boolean> {
  const visible = ref(basemap.visible)
  watch(visible, v => v !== basemap.visible && basemap.setVisible(v))
  basemap.on('change:visible', e => visible.value = e.visible)
  return visible
}

/** 底图控制钩子 */
function useBasemap (basemap: Basemap) : [Ref<string>, Ref<boolean>, string[]] {
  const key = useKey(basemap)
  const viisble = useVisible(basemap)
  const list = basemap.basemapItems
  return [key, viisble, list]
}

export default useBasemap
