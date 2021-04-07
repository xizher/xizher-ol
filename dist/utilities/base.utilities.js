import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
/**
 * 创建集合
 * @param arr 数组
 * @param options 配置项
 * @returns 集合
 */
export function createCollection(arr, options = {}) {
    return new Collection(arr, options);
}
/**
 * 创建要素
 * @param options 配置项
 */
export function createFeature(options = {}) {
    const feature = new Feature(options.geometry);
    feature.setStyle(options.style);
    return feature;
}
