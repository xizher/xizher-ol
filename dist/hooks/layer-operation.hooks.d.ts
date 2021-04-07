import { ComputedRef } from 'vue';
import { ILayerItem, LayerOperation } from '../plugins/layer-operation/layer-operation';
/**
 * 图层列表钩子
 * @param layerOperation 图层控制插件对象
 */
export declare function useLayerList(layerOperation: LayerOperation): [ILayerItem[], ComputedRef<ILayerItem[]>];
export default useLayerList;
