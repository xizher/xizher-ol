import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Modify, Draw, Snap } from 'ol/interaction'
import BaseTool, { OnToolActivedParams, OnToolActivedReture, OnToolDeActivedParams, OnToolDeActivedReture } from '../../base-tool'
import { IMap, IView } from '../../../../web-map/web-map'
import GeometryType from 'ol/geom/GeometryType'
import { IObserverCallbackParams } from '@xizher/observer'
import { Feature } from 'ol'

export type OnMarkClearParams<T> = IObserverCallbackParams<'mark-clear', T>
export type OnMarkClearReture = boolean

export declare type MarkGeometryType = 'Point' | 'LineString' | 'Polygon' | 'Circle'

/** 标记工具类 */
export class MarkTool extends BaseTool<{
  'mark-clear': void
  'change:mark-type': { type: MarkGeometryType }
}> {

  //#region 私有属性

  /** 矢量数据源 */
  private _source: VectorSource

  /** 矢量图层 */
  private _vectorLayer: VectorLayer

  /** 修改工具 */
  private _modify: Modify

  /** 绘图工具 */
  private _draw: Draw

  /** 编辑工具 */
  private _snap: Snap

  /** 标记类型 */
  private _markType: MarkGeometryType = 'Point'

  //#endregion

  //#region getter

  get layer () : VectorLayer {
    return this._vectorLayer
  }

  get markType () : MarkGeometryType {
    return this._markType
  }

  //#endregion

  //#region 构造函数

  /**
   * 构造标记工具对象
   * @param map 地图对象
   * @param view 视图对象
   */
  constructor (map:IMap, view: IView) {
    super(map, view, false)
    this._init()

    this.on('mark-clear', e => this.onMarkClear(e))
  }

  //#endregion

  //#region 私有方法

  /** 初始化 */
  private _init () {
    this._source = new VectorSource()
    this._vectorLayer = new VectorLayer({ source: this._source })
    this._modify = new Modify({ source: this._source })
    this._snap = new Snap({ source: this._source })
    this._createDraw()
  }

  /** 创建绘图工具 */
  private _createDraw () {
    this._draw = new Draw({
      source: this._source,
      type: this._markType as GeometryType,
    })
    return this._draw
  }

  //#endregion

  //#region 公有方法

  /** 清理标记 */
  clearMark () : this {
    this.fire('mark-clear')
    return this
  }

  /**
   * 清理指定标记
   * @param feature 标记要素
   */
  removeMark (feature: Feature) : this {
    this._source.removeFeature(feature)
    return this
  }

  /**
   * 设置标记类型
   * @param type 标记类型
   */
  setMarkType (type: MarkGeometryType) : this {
    this._markType = type
    this.fire('change:mark-type', { type })
    if (this.actived) {
      this.map.removeInteraction(this._draw)
      this.map.addInteraction(this._createDraw())
    } else {
      this._createDraw()
    }
    return this
  }

  /** 工具激化处理事件 */
  onToolActived (e: OnToolActivedParams<this>) : OnToolActivedReture {
    if (!super.onToolActived(e)) {
      return false
    }
    this.map.getLayers().remove(this._vectorLayer)
    this.map.addLayer(this._vectorLayer)
    this.map.addInteraction(this._modify)
    this.map.addInteraction(this._draw)
    this.map.addInteraction(this._snap)
    return true
  }

  /** 工具失活处理事件 */
  onToolDeActived (e: OnToolDeActivedParams<this>) : OnToolDeActivedReture {
    if (!super.onToolDeActived(e)) {
      return false
    }
    this.map.removeInteraction(this._modify)
    this.map.removeInteraction(this._draw)
    this.map.removeInteraction(this._snap)
    return true
  }

  /** 清理注记处理事件 */
  onMarkClear (e: OnMarkClearParams<this>) : OnMarkClearReture { // eslint-disable-line @typescript-eslint/no-unused-vars
    this._source.clear()
    if (!this.actived) {
      return false
    }
    return true
  }

  //#endregion

}

export default MarkTool
