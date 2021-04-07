import { Ref } from 'vue';
import BaseTool from '../plugins/map-tools/base-tool';
import { MapTools } from '../plugins/map-tools/map-tools';
/**
 * 地图工具链钩子
 * @param mapTools 地图工具链插件对象
 * @param toolKeys 当前激活的工具对应Key值
 */
declare function useMapTools(mapTools: MapTools, toolKeys?: string[]): [Ref<string>, string[]];
export default useMapTools;
/**
 * 创建自定义工具方法钩子
 * @param mapTools 地图工具链插件对象
 * @param toolObject 工具对象
 * @param toolKey 工具Key值，默认生成GUID
 */
export declare function useCreateTool(mapTools: MapTools, toolObject: BaseTool<unknown>, toolKey?: string): [() => void, () => void, string];
