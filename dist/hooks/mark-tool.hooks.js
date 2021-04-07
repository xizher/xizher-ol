import { onUnmounted, ref, watch } from 'vue';
const TOOLNAME = 'mark';
/**
 * 注记类型钩子
 * @param mapTools 地图工具链创建对象
 */
export function useType(mapTools) {
    const markTool = mapTools.getTool(TOOLNAME);
    const selectedType = ref(mapTools.activedKey === TOOLNAME ? markTool.markType : '');
    const handler = mapTools.on('change', e => {
        if (e.currentKey !== TOOLNAME) {
            selectedType.value = '';
        }
    });
    onUnmounted(() => handler.remove());
    watch(selectedType, val => {
        if (val) {
            markTool.setMarkType(val);
            mapTools.setMapTool(TOOLNAME);
        }
    });
    const handler2 = markTool.on('change:mark-type', e => {
        if (e.type !== selectedType.value) {
            selectedType.value = e.type;
        }
    });
    onUnmounted(() => handler2.remove());
    return selectedType;
}
/**
 * 注记类型可选列表钩子
 * @param mapTools 地图工具链创建对象
 */
export function useList() {
    const typeList = [
        { name: 'Point', alias: '点' },
        { name: 'LineString', alias: '线' },
        { name: 'Polygon', alias: '面' },
        { name: 'Circle', alias: '圆' }
    ];
    return typeList;
}
/**
 * 注记工具是否可用钩子
 * @param mapTools 地图工具链创建对象
 */
export function useEnabled(mapTools) {
    const enabled = ref(mapTools.activedKey === TOOLNAME);
    const handler = mapTools.on('change', e => {
        e.currentKey === TOOLNAME
            ? enabled.value = true
            : enabled.value = false;
    });
    onUnmounted(() => handler.remove());
    watch(enabled, b => {
        if (b) {
            mapTools.activedKey !== TOOLNAME && mapTools.setMapTool(TOOLNAME);
        }
        else {
            mapTools.activedKey === TOOLNAME && mapTools.setMapTool('default');
        }
    });
    return enabled;
}
/**
 * 注记清理钩子
 * @param mapTools 地图工具链创建对象
 */
export function useClearMark(mapTools) {
    const markTool = mapTools.getTool(TOOLNAME);
    return () => {
        markTool.clearMark();
    };
}
/**
 * 注记移除工具开启状态钩子
 * @param mapTools 地图工具链创建对象
 */
export function useMarkRemoveTool(mapTools) {
    const actived = ref(mapTools.activedKey === 'mark-remove');
    watch(actived, b => {
        if (b) {
            mapTools.activedKey !== 'mark-remove' && mapTools.setMapTool('mark-remove');
        }
        else {
            mapTools.activedKey === 'mark-remove' && mapTools.setMapTool('default');
        }
    });
    const handler = mapTools.on('change', e => actived.value = e.currentKey === 'mark-remove');
    onUnmounted(() => handler.remove());
    return actived;
}
/**
 * 注记工具钩子
 * @param mapTools 地图工具链创建对象
 */
export default function (mapTools) {
    const type = useType(mapTools);
    const list = useList();
    const enabled = useEnabled(mapTools);
    const clear = useClearMark(mapTools);
    const markRemoveToolActived = useMarkRemoveTool(mapTools);
    return [
        type,
        list,
        enabled,
        clear,
        markRemoveToolActived,
    ];
}
