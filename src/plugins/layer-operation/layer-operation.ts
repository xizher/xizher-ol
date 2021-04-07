import Layer from 'ol/layer/Layer'
import VectorSource from 'ol/source/Vector'
import { baseUtils } from '@xizher/js-utils'
import { createLayerGroup, createTileLayer, createVectorLayer } from '../../utilities/layer.utilities'
import WebMap from '../../web-map/web-map'
import WebMapPlugin from '../../web-map-plugin/web-map-plugin'
import GeoJSON from 'ol/format/GeoJSON'
import {bbox as bboxStrategy} from 'ol/loadingstrategy'
import LayerGroup from 'ol/layer/Group'
import { extend, Extent } from 'ol/extent'
import VectorLayer from 'ol/layer/Vector'
import TileWMS from 'ol/source/TileWMS'
import TileLayer from 'ol/layer/Tile'
import createFetch from '@xizher/fetch-helper'
import WMSCapabilities from 'ol/format/WMSCapabilities'
import { transformExtent } from 'ol/proj'
import { createStyle2, createUniqueStyle, IStyleOptions, IUniqueStyleOptions } from '../../utilities/style.utilities'

export type OgcServerString = 'wfs' | 'wms'

export interface IWMSCapabilitiesResult {
  Capability: {
    Layer: {
      Layer: {
        Name: string
        EX_GeographicBoundingBox: Extent // eslint-disable-line camelcase
      }[]
    }
    // ...
  }
  Service: {
    // ...
  },
  version: string
}

export interface ILayerItemOptions {
  name?: string
  type?: OgcServerString
  url?: string
  params?: Object // eslint-disable-line
  visible?: boolean
  style?: IStyleOptions | IUniqueStyleOptions// eslint-disable-line
}

export interface ILayerOperationOptions {
  layerItems?: ILayerItemOptions[]
}

export interface ILayerItem {
  id: string
  name: string
  // target: Layer
  visible: boolean
  opacity: number
  level: number
  type: OgcServerString
}

/** 插件：图层控制类 */
export class LayerOperation extends WebMapPlugin<{
  'change:visible': {
    layerName: string
    layer: Layer
    visible: boolean
  },
  'change:opacity': {
    layerName: string
    layer: Layer
    opacity: number
  },
  'change:level': {
    layerName: string
    layer: Layer
    level: number
  }
}> {

  //#region 私有属性

  /** 配置项 */
  private _options: ILayerOperationOptions = {}

  /** 图层池 */
  private _layerPool: Map<string, [Layer, ILayerItemOptions]> = new Map()

  /** 图层组 */
  private _layerGroup: LayerGroup

  //#endregion

  //#region 构造函数

  //#region getter

  get layerPool () : Map<string, ILayerItem> {
    const pool : Map<string, ILayerItem> = new Map()
    this._layerPool.forEach(([layer, options]) => {
      pool.set(options.name, {
        id: baseUtils.createGuid(),
        name: options.name,
        // target: layer,
        visible: layer.getVisible(),
        opacity: layer.getOpacity(),
        level: this._getLayerLevel(layer),
        type: options.type,
      })
    })
    return pool
  }

  //#endregion

  /** 构造图层控制对象 */
  constructor (options: ILayerOperationOptions = {}) {
    super('layerOperation')
    baseUtils.$extend(true, this._options, options)
  }

  //#endregion

  //#region 私有方法

  /** 初始化 */
  private _init () {
    this._layerGroup = createLayerGroup()
    this.map_.addLayer(this._layerGroup)
    this._options.layerItems?.forEach(layerItem => {
      this._initLayer(layerItem)
    })
  }

  /**
   * 创建图层
   * @param layerItemOptions 配置项
   */
  private _initLayer (layerItemOptions: ILayerItemOptions) {
    const type = layerItemOptions.type
    switch (type) {
      case 'wfs':
        this._initWfsLayer(layerItemOptions)
        break
      case 'wms':
        this._initWmsLayer(layerItemOptions)
        break
      default:
        break
    }
  }

  /** 初始化WFS图层 */
  private _initWfsLayer (layerItemOptions: ILayerItemOptions) {
    const layer = createVectorLayer({
      visible: true
    })
    layer.on('change:visible', () => this.fire('change:visible', {
      layer, visible: layer.getVisible(), layerName: layerItemOptions.name
    }))
    layer.on('change:opacity', () => this.fire('change:opacity', {
      layer, opacity: layer.getOpacity(), layerName: layerItemOptions.name
    }))
    layer.once('postrender', () => layer.setVisible(layerItemOptions.visible))
    const source = new VectorSource({
      format: new GeoJSON(),
      url: layerItemOptions.url,
      strategy: bboxStrategy
    })
    layer.setSource(source)
    if (layerItemOptions.style) {
      (layerItemOptions.style as IUniqueStyleOptions).uniqueField
        ? layer.setStyle(createUniqueStyle((layerItemOptions.style as IUniqueStyleOptions)))
        : layer.setStyle(createStyle2(layerItemOptions.style as IStyleOptions))
    }
    this._layerGroup.getLayers().push(layer)
    this._layerPool.set(layerItemOptions.name, [layer, layerItemOptions])
  }

  /** 初始化WMS图层 */
  private _initWmsLayer (layerItemOptions: ILayerItemOptions) {
    const source = new TileWMS({
      url: layerItemOptions.url,
      params: { ...layerItemOptions.params }
    })
    const layer = createTileLayer({ source, visible: layerItemOptions.visible })
    this._layerGroup.getLayers().push(layer)
    this._layerPool.set(layerItemOptions.name, [layer, layerItemOptions])
    const [url] = (layer.getSource() as TileWMS).getUrls()
    createFetch() // getExtent is undefined, need to set
      .setUrl(url)
      .setParams({ 'REQUEST': 'GetCapabilities' })
      .setParams({ 'outputFormat': 'application/json' })
      .mountGet()
      .then(res => res.text())
      .then(res => {
        const wmsCapabilities = new WMSCapabilities().read(res) as IWMSCapabilitiesResult
        let extent = wmsCapabilities.Capability.Layer.Layer.find(item => item.Name === layerItemOptions.params['LAYERS'].split(':')[1])?.EX_GeographicBoundingBox // TODO maybe wrong
        extent = transformExtent(extent, 'EPSG:4326', this.view_.getProjection())
        layer.setExtent(extent)
      })
  }

  /** 获取指定图层范围 */
  private _getLayerExtent (layer: Layer) : Extent | null {
    if (layer instanceof VectorLayer) {
      return layer.getSource().getExtent()
    }
    if (layer instanceof TileLayer) {
      return layer.getExtent()
    }
  }

  /**
   * 获取图层层级
   * @param layer 图层对象
   */
  private _getLayerLevel (layer: Layer) : number {
    const layerArr = this._layerGroup.getLayersArray()
    for (let i = 0; i < layerArr.length; i++) {
      if (layerArr[i] === layer) {
        return i
      }
    }
    return -1
  }

  /**
   * 获取图层名称
   * @param layer 图层对象
   */
  private _getLayerName (layer: Layer) : string | null {
    const arr = [...this._layerPool.entries()]
    for (let i = 0; i < arr.length; i ++) {
      if (layer === arr[i][1][0]) {
        return arr[i][0]
      }
    }
    return null
  }

  //#endregion

  //#region 公有方法

  /** 安装插件 */
  public installPlugin (webMap: WebMap) : this {
    super.installPlugin(webMap)
    this._init()
    return this
  }

  /** 获取所有图层的综合范围 */
  public getFullExtent () : Extent | null {
    const layers = [...this._layerPool.values()]
    let extent : Extent | null = null
    layers.forEach(([lyr]) => {
      const newExtent = this._getLayerExtent(lyr)
      if (extent) {
        extent = extend(extent, newExtent)
      } else {
        extent = newExtent
      }
    })
    return extent
  }

  /** 通过图层名获取图层对象 */
  public getLayerByName (name: string) : Layer | null {
    if (!this._layerPool.has(name)) {
      return null
    }
    const [layer] = this._layerPool.get(name)
    return layer
  }

  /**
   * 设置图层可见性
   * @param arg0 图层名 或 图层对象
   * @param visible 图层可见性，默认true
   */
  public setLayerVisible (arg0: string | Layer, visible = true) : this {
    const layer = typeof arg0 === 'string'
      ? this.getLayerByName(arg0)
      : arg0
    if (!layer) {
      return
    }
    layer.setVisible(visible)
    return this
  }

  /**
   * 设置图层透明度
   * @param arg0 图层名 或 图层对象
   * @param opacity 不可透明度
   */
  public setLayerOpacity (arg0: string | Layer, opacity: number) : this {
    const layer = typeof arg0 === 'string'
      ? this.getLayerByName(arg0)
      : arg0
    if (!layer) {
      return
    }
    layer.setOpacity(opacity)
    return this
  }

  /**
   * 设置图层层级
   * @param arg0 图层名 或 图层对象
   * @param level 图层层级
   */
  public setLayerLevel (arg0: string | Layer, level: number) : this {
    const layer = typeof arg0 === 'string'
      ? this.getLayerByName(arg0)
      : arg0
    if (!layer) {
      return
    }
    this._layerGroup.getLayers().remove(layer)
    this._layerGroup.getLayers().insertAt(level, layer)
    this.fire('change:level', {
      layerName: typeof arg0 === 'string' ? arg0 : this._getLayerName(layer), layer, level
    })
    return this
  }

  /**
   * 缩放至图层
   * @param arg0 图层名 或 图层对象
   */
  public zoomToLayer (arg0: string | Layer) : this {
    const layer = typeof arg0 === 'string'
      ? this.getLayerByName(arg0)
      : arg0
    if (!layer) {
      return
    }
    const extent = this._getLayerExtent(layer)
    if (extent) {
      this.view_.fit(extent, { duration: 500 })
    }
    return this
  }

  /**
   * 获取图层属性
   * @param arg0 图层名 或 图层对象
   */
  public getAttributes <T extends { [key: string]: any }> (arg0: string | Layer) : T[] | null { // eslint-disable-line
    const name = typeof arg0 === 'string'
      ? arg0
      : this._getLayerName(arg0)
    const [layer, options] = this._layerPool.get(name) as [VectorLayer, ILayerItemOptions]
    if (!layer) {
      return null
    }
    if (options.type !== 'wfs') {
      return null
    }
    return layer.getSource().getFeatures().map(
      (feat, index) => {
        const props = feat.getProperties()
        delete props.geometry
        props.$index = index
        props.$id = feat.getId()
        return props
      }
    ) as T[]
  }

  //#endregion

}

export default LayerOperation
