import XYZ, { Options as IXYZOptions } from 'ol/source/XYZ'
import TileLayer from 'ol/layer/Tile'
import OSM, { Options as IOSMOptions } from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import LayerGroup, { Options as ILayerGroup } from 'ol/layer/Group'
import VectorLayer from 'ol/layer/Vector'
import { Options as IBaseTileOptions } from 'ol/layer/BaseTile'
import { Options as IBaseVectorOptions } from 'ol/layer/BaseVector'
import { baseUtils } from '@xizher/js-utils'

/**
 * 创建XYZ图层
 * @param xyzUrl XYZ地址
 * @param options 配置项
 * @returns XYZ图层
 */
export function createXYZLayer (
  xyzUrl: string,
  options: {
    xyzOptions?: IXYZOptions
    layerOptions?: IBaseTileOptions
  } = {}
) : TileLayer {
  const _options : IXYZOptions = {
    url: xyzUrl
  }
  baseUtils.$extend(true, _options, options.xyzOptions ?? {})
  const source = new XYZ(_options)
  return new TileLayer({ ...(options.layerOptions ?? {}), source })
}

/**
 * 创建OSM图层
 * @param options 配置项
 * @returns OSM图层
 */
export function createOSMLayer (options: {
  osmOptions?: IOSMOptions
  layerOptions?: IBaseTileOptions
} = {}) : TileLayer {
  const source = new OSM(options.osmOptions ?? {})
  return new TileLayer({ ...(options.layerOptions ?? {}), source })
}

/**
 * 创建图层组
 * @param options 配置项
 * @returns 图层组
 */
export function createLayerGroup (options: ILayerGroup = {}) : LayerGroup {
  return new LayerGroup(options)
}

/**
 * 创建矢量图层
 * @param options 配置项
 * @returns 矢量图层
 */
export function createVectorLayer (options: IBaseVectorOptions = {}) : VectorLayer {
  return new VectorLayer({ source: new VectorSource(), ...options })
}

/**
 * 创建Tile图层
 * @param options 配置项
 * @returns Tile图层
 */
export function createTileLayer (options: IBaseTileOptions = {}) : TileLayer {
  return new TileLayer(options)
}
