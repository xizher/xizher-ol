import { baseUtils } from '@xizher/js-utils'
import Collection from 'ol/Collection'
import BaseLayer from 'ol/layer/Base'
import LayerGroup from 'ol/layer/Group'
import { createCollection } from '../../utilities/base.utilities'
import { createLayerGroup, createOSMLayer, createXYZLayer } from '../../utilities/layer.utilities'
import WebMapPlugin from '../../web-map-plugin/web-map-plugin'
import WebMap from '../../web-map/web-map'


/** 天地图密钥 */
const TIAN_DI_TU_KEY = 'd524142425d379adcf285daba823e28a'

export interface IBasemapOptions {
  key?: string
  visible?: boolean
}

export class Basemap extends WebMapPlugin<{
  'change': { key: string, visible: boolean }
  'change:key': { key: string }
  'change:visible': { visible: boolean }
}> {

  //#region 私有静态属性

  /** 天地图墨卡托投影路径集合 */
  private static readonly _TianDiTu3857Urls = {
    '影像底图': `http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
    '影像注记': `http://t0.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
    '矢量底图': `http://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
    '矢量注记': `http://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
    '地形底图': `http://t0.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
    '地形注记': `http://t0.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
  }

  /** 天地图经纬度投影路径集合 */
  private static readonly _TianDiTu4326Urls = {
    '影像底图': `http://t0.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
    '影像注记': `http://t0.tianditu.gov.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
    '矢量底图': `http://t0.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
    '矢量注记': `http://t0.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
    '地形底图': `http://t0.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
    '地形注记': `http://t0.tianditu.gov.cn/cta_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
  }

  /** 捷泰地图路径集合 */
  private static readonly _GeoQUrls = {
    '彩色地图': 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}',
    '灰色地图': 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}',
    '蓝黑色地图': 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
    '暖色地图': 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}',
  }

  /** 无Key值对应底图项异常提醒 */
  private static readonly _NoKeyOfBasemapItemException = '当前key值无对应底图项'

  //#endregion

  //#region 私有属性

  /** 底图项容器池 */
  private _basemapItemPool : Map<string, Collection<BaseLayer>> = new Map()

  /** 当前选择的底图项 */
  private _key: string

  /** 底图可见性 */
  private _visible: boolean

  /** 底图存储图层组 */
  private _layerGroup: LayerGroup

  /** 配置项 */
  private _options: IBasemapOptions = {
    visible: true,
    key: '天地图矢量3857',
  }

  //#endregion

  //#region getter

  public get key () : string {
    return this._key
  }

  public get visible () : boolean {
    return this._visible
  }

  public get basemapItems () : string[] {
    return [...this._basemapItemPool.keys()]
  }

  //#endregion

  //#region 构造函数

  /**
   * 构造底图控制插件类
   * @param options 配置项
   */
  constructor (options: IBasemapOptions) {
    super('basemap')
    baseUtils.$extend(true, this._options, options)
    this._key = this._options.key
    this._visible = this._options.visible
  }

  //#endregion

  //#region 私有方法

  /** 初始化 */
  private _init () : this {
    this._layerGroup = createLayerGroup()
    this.map_.getLayers().insertAt(0, this._layerGroup)
    this.map_.$owner.on('loaded', () => this.reSortLayers())
    return this
      ._createGeoQDiTu()
      ._createTianDiTu()
      .createBasemapItem('osm', createOSMLayer())
      .setBasemap(this._key)
      .setVisible(this._visible)
  }

  /**
   * 创建天地图底图项
   * @returns this
   */
  private _createTianDiTu () : this {
    const createTianDiTuItem = (name: string, proj: string) => {
      this.createBasemapItem(`天地图${name}${proj}`, createXYZLayer(Basemap[`_TianDiTu${proj}Urls`][`${name}底图`]))
      this.createBasemapItem(`天地图${name}含注记${proj}`, [
        createXYZLayer(Basemap[`_TianDiTu${proj}Urls`][`${name}底图`]),
        createXYZLayer(Basemap[`_TianDiTu${proj}Urls`][`${name}注记`]),
      ])
      return createTianDiTuItem
    }
    createTianDiTuItem('影像', '4326')('矢量', '4326')('地形', '4326')('影像', '3857')('矢量', '3857')('地形', '3857')
    return this
  }

  private _createGeoQDiTu () : this {
    Object.entries(Basemap._GeoQUrls).forEach(
      ([key, url]) => this._basemapItemPool.set(key, createCollection([createXYZLayer(url)]))
    )
    return this
  }

  //#endregion

  //#region 公有方法

  /**
   * 重写：安装插件
   * @param webMap WebMap对象
   * @returns this
   */
  public installPlugin (webMap: WebMap) : this {
    super.installPlugin(webMap)
    return this._init()
  }

  /**
   * 重新调整底图图层位置
   * @returns this
   */
  public reSortLayers () : this {
    this.map_.getLayers().remove(this._layerGroup)
    this.map_.getLayers().insertAt(0, this._layerGroup)
    return this
  }

  /**
   * 设置底图项
   * @param key 底图项Key值
   * @returns this
   */
  public setBasemap (key: string) : this {
    if (this._basemapItemPool.has(key)) {
      this._layerGroup.setLayers(this._basemapItemPool.get(key))
      this._key = key
      this.fire('change:key', { key })
      this.fire('change', { key, visible: this._visible })
      return this
    }
    console.warn(Basemap._NoKeyOfBasemapItemException, key)
    return this
  }

  /**
   * 设置底图可见性
   * @param visible 可见性
   * @returns this
   */
  public setVisible (visible: boolean): this {
    this._layerGroup.setVisible(visible)
    this._visible = visible
    this.fire('change:visible', { visible })
    this.fire('change', { visible, key: this._key })
    return this
  }

  /**
   * 创建底图项
   * @param key 底图项Key值
   * @param layer 底图图层
   */
  public createBasemapItem (key: string, layer: BaseLayer) : this
  /**
   * 创建底图项
   * @param key 底图项Key值
   * @param layers 底图图层数组
   */
  public createBasemapItem (key: string, layers: BaseLayer[]) : this
  /**
   * 创建底图项
   * @param key 底图项
   * @param arg1 底图图层 or 底图图层数组
   * @returns this
   */
  public createBasemapItem (key: string, arg1: BaseLayer | BaseLayer[]) : this {
    const layers = Array.isArray(arg1) ? arg1 : [arg1]
    this._basemapItemPool.set(key, createCollection(layers))
    return this
  }

  /**
   * 创建并设置底图项
   * @param key 底图项Key值
   * @param layer 底图图层
   */
  public createBasemapItemAndSet (key: string, layer: BaseLayer) : this
  /**
   * 创建并设置底图项
   * @param key 底图项Key值
   * @param layers 底图图层数组
   */
  public createBasemapItemAndSet (key: string, layers: BaseLayer[]) : this
  /**
   * 创建并设置底图项
   * @param key 底图项
   * @param arg1 底图图层 or 底图图层数组
   * @returns this
   */
  public createBasemapItemAndSet (key: string, arg1: BaseLayer | BaseLayer[]) : this {
    // eslint-disable-next-line
    // @ts-ignore
    return this.createBasemapItem(key, arg1).setBasemap(key)
  }

  //#endregion

}

export default Basemap
