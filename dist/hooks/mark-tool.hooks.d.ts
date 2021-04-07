import { Ref } from 'vue';
import { MapTools } from '../plugins/map-tools/map-tools';
/**
 * 注记类型钩子
 * @param mapTools 地图工具链创建对象
 */
export declare function useType(mapTools: MapTools): Ref<string>;
/**
 * 注记类型可选列表钩子
 * @param mapTools 地图工具链创建对象
 */
export declare function useList(): {
    name: string;
    alias: string;
}[];
/**
 * 注记工具是否可用钩子
 * @param mapTools 地图工具链创建对象
 */
export declare function useEnabled(mapTools: MapTools): Ref<boolean>;
/**
 * 注记清理钩子
 * @param mapTools 地图工具链创建对象
 */
export declare function useClearMark(mapTools: MapTools): () => void;
/**
 * 注记移除工具开启状态钩子
 * @param mapTools 地图工具链创建对象
 */
export declare function useMarkRemoveTool(mapTools: MapTools): Ref<boolean>;
/**
 * 注记工具钩子
 * @param mapTools 地图工具链创建对象
 */
export default function (mapTools: MapTools): [
    Ref<string>,
    {
        name: string;
        alias: string;
    }[],
    Ref<boolean>,
    () => void,
    Ref<boolean>
];
