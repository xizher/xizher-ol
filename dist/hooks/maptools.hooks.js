import { onUnmounted, reactive, ref, watch } from 'vue';
import { baseUtils } from '@xizher/js-utils';
/**
 * 地图工具链钩子
 * @param mapTools 地图工具链插件对象
 * @param toolKeys 当前激活的工具对应Key值
 */
function useMapTools(mapTools, toolKeys = []) {
    const activedKey = ref(mapTools.activedKey);
    watch(activedKey, k => (k !== mapTools.activedKey) && mapTools.setMapTool(k));
    mapTools.on('change', e => activedKey.value = e.currentKey);
    const list = reactive(toolKeys);
    return [activedKey, list];
}
export default useMapTools;
/**
 * 创建自定义工具方法钩子
 * @param mapTools 地图工具链插件对象
 * @param toolObject 工具对象
 * @param toolKey 工具Key值，默认生成GUID
 */
export function useCreateTool(mapTools, toolObject, toolKey) {
    const key = toolKey ?? baseUtils.createGuid();
    mapTools.createCustomTool(key, toolObject);
    onUnmounted(() => mapTools.deleteTool(key));
    const active = () => mapTools.setMapTool(key);
    const deactive = () => mapTools.setMapTool('default');
    return [active, deactive, key];
}
