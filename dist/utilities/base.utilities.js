import Collection from 'ol/Collection';
/**
 * 创建集合
 * @param arr 数组
 * @param options 配置项
 * @returns 集合
 */
export function createCollection(arr, options = {}) {
    return new Collection(arr, options);
}
