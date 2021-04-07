import { Feature, MapBrowserEvent, Overlay } from 'ol'
import { Coordinate } from 'ol/coordinate'
import { EventsKey } from 'ol/events'
import Geometry from 'ol/geom/Geometry'
import GeometryType from 'ol/geom/GeometryType'
import LineString from 'ol/geom/LineString'
import Polygon from 'ol/geom/Polygon'
import { Draw } from 'ol/interaction'
import VectorLayer from 'ol/layer/Vector'
import { unByKey } from 'ol/Observable'
import OverlayPositioning from 'ol/OverlayPositioning'
import VectorSource from 'ol/source/Vector'
import { createStyle2 } from '../../../../utilities/style.utilities'
import { IMap, IView } from '../../../../web-map/web-map'
import BaseTool, { OnToolActivedParams, OnToolActivedReture, OnToolDeActivedParams, OnToolDeActivedReture } from '../../base-tool'
import './measure-tool.css'

export type MeasureType = 'area' | 'length' | ''

/** 测量工具类 */
export class MeasureTool extends BaseTool<{
  'change:type': { type: MeasureType }
}> {

  //#region 私有静态属性

  private static _MSG_START_TO_DRAW = 'Click to start drawing'

  private static _MSG_CONTIUNE_POLYLINE = 'Click to continue drawing the polyline'

  private static _MSG_CONTIUNE_POLYGON = 'Click to continue drawing the polygon'

  //#endregion

  //#region 私有属性

  /** 测量要素 */
  private _feature: Feature

  /** 提示层DOM元素 */
  private _helpTooltipElement: HTMLElement

  /** 提示层对象 */
  private _helpTooltip: Overlay

  /** 鼠标移动处理事件 */
  private _handlerMousemove: (e: MapBrowserEvent) => void

  /** 鼠标离开处理事件 */
  private _handlerMouseout: (e: MouseEvent) => void

  /** 测量信息DOM元素 */
  private _measureTooltipElement: HTMLElement

  /** 测量信息层对象 */
  private _measureTooltip: Overlay

  private _measureTooltipPool: Map<Feature, Overlay> = new Map()

  /** 测量矢量数据源 */
  private _source: VectorSource

  /** 测量矢量图层 */
  private _vectorLayer: VectorLayer

  /** 绘制器 */
  private _draw: Draw

  /** 测量方式 */
  private _measureType: MeasureType = 'length'

  //#endregion

  //#region getter

  get type () : MeasureType {
    return this._measureType
  }

  get layer () : VectorLayer {
    return this._vectorLayer
  }

  //#endregion

  //#region 构造函数

  /**
   * 构造测量工具类
   * @param map 地图对象
   * @param view 视图对象
   */
  constructor (map: IMap, view: IView) {
    super(map, view, false)
    this._init()
  }

  //#endregion

  //#region 私有方法

  private _init () {
    this._source = new VectorSource()
    this._vectorLayer = new VectorLayer({
      source: this._source,
      style: createStyle2({
        fill: { color: 'rgba(255, 255, 255, 0.2)' },
        stroke: {
          color: '#ffcc33',
          width: 2,
        },
        image: {
          styleType: 'circle',
          radius: 7,
          fill: { color: '#ffcc33', }
        },
      }),
    })
    this._createMousemoveHandler()
    this._createMouseoutHandler()
  }

  /** 创建绘图工具 */
  private _createDraw () {
    this._draw = new Draw({
      source: this._source,
      type: (this._measureType === 'area' ? 'Polygon' : 'LineString') as GeometryType,
      style: createStyle2({
        fill: { color: 'rgba(255, 255, 255, 0.2)' },
        stroke: {
          color: 'rgba(0, 0, 0, 0.5)',
          lineDash: [10, 10],
          width: 2,
        },
        image: {
          styleType: 'circle',
          radius: 5,
          stroke: { color: 'rgba(0, 0, 0, 0.7)' },
          fill: { color: 'rgba(255, 255, 255, 0.2)' },
        },
      }),
    })
    let listener: EventsKey
    this._draw.on('drawstart', event => {
      this._feature = event.feature
      let tooltipCoordinate: Coordinate
      listener = this._feature.getGeometry().on('change', evt => {
        const geometry = evt.target as Geometry
        let output = ''
        if (geometry instanceof Polygon) {
          output = this._formatArea(geometry)
          tooltipCoordinate = geometry.getInteriorPoint().getCoordinates()
        } else if (geometry instanceof LineString) {
          output = this._formatLength(geometry)
          tooltipCoordinate = geometry.getLastCoordinate()
        }
        this._measureTooltipElement.innerHTML = output
        this._measureTooltip.setPosition(tooltipCoordinate)
      })
    })
    this._draw.on('drawend', () => {
      this._measureTooltipElement.className = 'ol-tooltip ol-tooltip-static'
      this._measureTooltip.setOffset([0, -7])
      this._measureTooltipPool.set(this._feature, this._measureTooltip)
      this._feature = null
      this._measureTooltipElement = null
      this._createMeasureTooltip()
      unByKey(listener)
    })
    return this._draw
  }

  private _createMousemoveHandler () {
    this._handlerMousemove = e => {
      if (e.dragging) {
        return
      }
      let msg = MeasureTool._MSG_START_TO_DRAW
      if (this._feature) {
        const geom = this._feature.getGeometry()
        if (geom instanceof Polygon) {
          msg = MeasureTool._MSG_CONTIUNE_POLYGON
        } else {
          msg = MeasureTool._MSG_CONTIUNE_POLYLINE
        }
      }
      this._helpTooltipElement.innerHTML = msg
      this._helpTooltip.setPosition(e.coordinate)
      this._helpTooltipElement.classList.remove('hidden')
    }
    return this._handlerMousemove
  }

  private _createMouseoutHandler () {
    this._handlerMouseout = () => {
      this._helpTooltipElement.classList.add('hidden')
    }
    return this._handlerMouseout
  }

  /** 创建帮助提醒 */
  private _createHelpTooltip () {
    if (this._helpTooltipElement) {
      this._helpTooltipElement.parentNode.removeChild(this._helpTooltipElement)
    }
    this._helpTooltipElement = document.createElement('div')
    this._helpTooltipElement.className = 'ol-tooltip hidden'
    this._helpTooltip = new Overlay({
      element: this._helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left' as OverlayPositioning,
    })
    this.map.addOverlay(this._helpTooltip)
  }

  /** 创建测量提醒 */
  private _createMeasureTooltip () {
    if (this._measureTooltipElement) {
      this._measureTooltipElement.parentNode.removeChild(this._measureTooltipElement)
    }
    this._measureTooltipElement = document.createElement('div')
    this._measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure'
    this._measureTooltip = new Overlay({
      element: this._measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center' as OverlayPositioning,
    })
    this.map.addOverlay(this._measureTooltip)
  }

  /**
   * 计算面积
   * @param polygon 面对象
   */
  private _formatArea (polygon: Polygon) : string {
    const area = polygon.getArea()
    if (area > 10000) {
      return `${Math.round((area / 1000000) * 100) / 100}km<sup>2</sup>`
    }
    return `${Math.round(area * 100) / 100}m<sup>2</sup>`
  }

  /**
   * 计算长度
   * @param line 线对象
   */
  private _formatLength (line: LineString) : string {
    const length = line.getLength()
    if (length > 100) {
      return `${Math.round((length / 1000) * 100) / 100}km`
    }
    return `${Math.round(length * 100) / 100}m`
  }

  //#endregion

  //#region 公有方法

  /** 清理测量信息 */
  clearMeasure () : this {
    // this._measureTooltipPool.forEach(item => {
    //   this.map.removeOverlay(item)
    // })
    // ext(this._measureTooltipPool).clear()
    this._measureTooltipPool.forEach(overlay => {
      this.map.removeOverlay(overlay)
    })
    this._measureTooltipPool.clear()
    this._source.clear()
    return this
  }

  /**
   * 移除测量信息
   * @param feature 测量要素
   */
  removeMeasure (feature: Feature) : this {
    const overlay = this._measureTooltipPool.get(feature)
    this.map.removeOverlay(overlay)
    this._source.removeFeature(feature)
    this._measureTooltipPool.delete(feature)
    return this
  }

  /** 设置测量类型 */
  setMeasureType (type: MeasureType) : this {
    this._measureType = type
    this.fire('change:type', { type })
    if (this.actived) {
      this._feature = null
      this.map.removeOverlay(this._measureTooltip)
      this._createMeasureTooltip()
      this.map.removeInteraction(this._draw)
      this.map.addInteraction(this._createDraw())
    }
    return this
  }

  /** 工具激化处理事件 */
  onToolActived (e: OnToolActivedParams<this>) : OnToolActivedReture {
    if (!super.onToolActived(e)) {
      return false
    }
    this._createHelpTooltip()
    this._createMeasureTooltip()
    this._createDraw()
    this.map.getLayers().remove(this._vectorLayer)
    this.map.addLayer(this._vectorLayer)
    this.map.addInteraction(this._draw)
    this.map.on('pointermove', this._handlerMousemove)
    this.map.getViewport().addEventListener('mouseout', this._handlerMouseout)
    return true
  }

  /** 工具失活处理事件 */
  onToolDeActived (e: OnToolDeActivedParams<this>) : OnToolDeActivedReture {
    if (!super.onToolDeActived(e)) {
      return false
    }
    this._feature = null
    this.map.removeOverlay(this._helpTooltip)
    this.map.removeOverlay(this._measureTooltip)
    this.map.removeInteraction(this._draw)
    this.map.un('pointermove', this._handlerMousemove)
    this.map.getViewport().removeEventListener('mouseout', this._handlerMouseout)
    return true
  }

  //#endregion

}

export default MeasureTool
