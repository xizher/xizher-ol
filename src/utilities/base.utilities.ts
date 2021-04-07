import Collection, { Options as ICollectionOptions } from 'ol/Collection'
import Feature from 'ol/Feature'
import Geometry from 'ol/geom/Geometry'
import Style from 'ol/style/Style'

/**
 * 创建集合
 * @param arr 数组
 * @param options 配置项
 * @returns 集合
 */
export function createCollection<T> (arr: T[], options: ICollectionOptions = {}) : Collection<T> {
  return new Collection(arr, options)
}


/**
 * 创建要素
 * @param options 配置项
 */
export function createFeature (options: {
  style?: Style
  geometry?: Geometry
} = {}) : Feature {
  const feature = new Feature(options.geometry)
  feature.setStyle(options.style)
  return feature
}
