import { Ref } from 'vue';
import { MapTools } from '../plugins/map-tools/map-tools';
import { MeasureType } from '../plugins/map-tools/tools/measure/measure-tool';
/**
 * 测量工具开启状态钩子
 * @param mapTools 地图工具链插件对象
 */
export declare function useEnabled(mapTools: MapTools): Ref<boolean>;
/**
 * 测量类型钩子
 * @param mapTools 地图工具链插件对象
 */
export declare function useType(mapTools: MapTools): Ref<MeasureType>;
/**
 * 测量类型列表钩子
 * @param mapTools 地图工具链插件对象
 */
export declare function useList(): {
    name: MeasureType;
    alias: string;
}[];
/**
 * 测量清理钩子
 * @param mapTools 地图工具链插件对象
 */
export declare function useClearMeasure(mapTools: MapTools): () => void;
/**
 * 测量移除工具开启状态钩子
 * @param mapTools 地图工具链插件对象
 */
export declare function useMeasureRemoveTool(mapTools: MapTools): Ref<boolean>;
/**
 * 测量工具钩子
 * @param mapTools 地图工具链插件对象
 */
export default function (mapTools: MapTools): [
    Ref<string>,
    {
        name: MeasureType;
        alias: string;
    }[],
    Ref<boolean>,
    () => void,
    Ref<boolean>
];
