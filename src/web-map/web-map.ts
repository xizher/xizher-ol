import Observer from '@xizher/observer'
import OlMap from 'ol/Map'
import { MapOptions } from 'ol/PluggableMap'
import OlView, { ViewOptions } from 'ol/View'
import { baseUtils } from '@xizher/js-utils'
import WebMapPlugin from '../web-map-plugin/web-map-plugin'
import Basemap from '../plugins/basemap/basemap'
import MapCursor from '../plugins/map-cursor/map-cursor'
import MapElementDisplay from '../plugins/map-element-display/map-element-display'

/** 地图对象接口 */
export interface IMap extends OlMap {
  $owner: WebMap
}

/** 视图对象接口 */
export interface IView extends OlView {
  $owner: WebMap
}

/** WebMap配置项接口 */
export interface IWebMapOptions {
  mapOptions?: MapOptions
  viewOptions?: ViewOptions
}

/** WebMap类 */
export class WebMap extends Observer<{
  'loaded': void
}> {

  //#region 公有属性（插件对象）

  basemap?: Basemap
  mapCursor?: MapCursor
  mapElementDisplay?: MapElementDisplay

  //#endregion

  //#region 私有属性

  /** 地图目标容器Id */
  private _targetDiv: string

  /** 地图对象 */
  private _map: IMap

  /** 视图对象 */
  private _view: IView

  /** 配置项 */
  private _options: IWebMapOptions = {
    viewOptions: {
      center: [0, 0],
      zoom: 1,
      projection: 'EPSG:3857'
    },
    mapOptions: {
      controls: []
    }
  }

  //#endregion

  //#region getter

  public get targetDiv () : string {
    return this._targetDiv
  }

  public get map () : IMap {
    return this._map
  }

  public get view () : IView {
    return this._view
  }

  //#endregion

  //#region 构造函数

  /**
   * 构造WebMap对象
   * @param targetDiv 地图容器Id
   * @param options 配置项
   */
  constructor (targetDiv: string, options: IWebMapOptions = {}) {
    super ()
    this._targetDiv = targetDiv
    baseUtils.$extend(true, this._options, options)
    this._init()
  }

  //#endregion

  //#region 私有方法

  /** 初始化 */
  private _init () : this {
    const { mapOptions, viewOptions } = this._options
    const view = new OlView(viewOptions)
    const map = new OlMap({ ...mapOptions, view })
    this._view = Object.assign(view, { $owner: this })
    this._map = Object.assign(map, { $owner: this })
    return this
  }

  //#endregion

  //#region 公有方法

  /**
 * 挂载插件
 * @param plugin WebMap插件对象
 */
  public use <T> (plugin: WebMapPlugin<T>) : WebMap {
    this[plugin.pluginName] = plugin.installPlugin(this)
    return this
  }

  /**
   * 挂载WebMap
   */
  public mount () : WebMap {
    this._map.setTarget(this._targetDiv)
    this.fire('loaded')
    return this
  }

  //#endregion

}

export default WebMap
