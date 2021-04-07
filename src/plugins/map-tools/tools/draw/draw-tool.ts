import Geometry from 'ol/geom/Geometry'
import { IObserverCallbackParams } from '@xizher/observer'
import { createCircle, createLineString, createPoint, createPolygon } from '../../../../utilities/geom.utilities'
import { IMap, IView } from '../../../../web-map/web-map'
import { MapCursorType } from '../../../map-cursor/map-cursor'
import BaseTool, {
  OnToolActivedParams,
  OnToolActivedReture,
  OnToolDeActivedParams,
  OnToolDeActivedReture
} from '../../base-tool'
import Drawer from './drawer'
import { Feature } from 'ol'
import { Coordinate } from 'ol/coordinate'
import ext from '@xizher/js-ext'
import { baseUtils } from '@xizher/js-utils'
import { unByKey } from 'ol/Observable'

export type DrawType =
  'point' |
  'line' |
  'line-faster' |
  'polyline' |
  'polygon' |
  'rectangle' |
  'rectangle-faster' |
  'circle' |
  'circle-faster'

export type OnDrawStartParams<T> = IObserverCallbackParams<'draw-start', T> & { coordinate: Coordinate }
export type OnDrawMoveParams<T> = IObserverCallbackParams<'draw-move', T> & { geometry: Geometry }
export type OnDrawEndParams<T> = IObserverCallbackParams<'draw-end', T> & { geometry: Geometry }
export type OnDrawClearParams<T> = IObserverCallbackParams<'draw-clear', T>
export type OnDrawStartReture = Coordinate | false
export type OnDrawMoveReture = Feature[] | false
export type OnDrawEndReture = Feature[] | false
export type OnDrawClearReture = boolean

export interface DrawToolOptions {
  drawType?: DrawType,
  cursorType?: MapCursorType,
  isDrawOnlyOneTarget?: boolean
}


/** 绘图工具 */
export class DrawTool<T = {

}> extends BaseTool<T & {
    'draw-start': { coordinate: Coordinate }
    'draw-move': { geometry: Geometry }
    'draw-end': { geometry: Geometry }
    'draw-clear': {} // eslint-disable-line @typescript-eslint/ban-types
  }> {

  //#region 私有属性

  /** 绘图类型 */
  private _drawType: DrawType

  /** 鼠标样式 */
  private _cursorType: MapCursorType

  /** 是否只绘制单一目标 */
  private _isDrawOnlyOneTarget: boolean

  /** 记录当前存在的绘制图元 */
  private _features: Feature[]

  //#endregion

  //#region 保护属性

  /** 绘图器对象 */
  protected drawer_: Drawer

  //#endregion

  //#region getter

  get isDrawOneTarget () : boolean {
    return this._isDrawOnlyOneTarget
  }

  //#endregion

  //#region setter

  set isDrawOneTarget (b: boolean) {
    this._isDrawOnlyOneTarget = b
  }

  //#endregion

  //#region 构造函数

  /**
   * 构造绘图工具对象
   * @param map 地图对象
   * @param view 视图对象
   * @param drawType 绘图类型
   * @param cursorType 鼠标类型
   */
  constructor (map: IMap, view:IView, options?: DrawToolOptions) {
    super(map, view, false)
    const _options : DrawToolOptions = {
      cursorType: 'draw',
      drawType: 'point',
      isDrawOnlyOneTarget: false
    }
    baseUtils.$extend(true, _options, options)
    this.drawer_ = new Drawer(map.$owner.mapElementDisplay)
    this._drawType = _options.drawType
    this._cursorType = _options.cursorType
    this._isDrawOnlyOneTarget = _options.isDrawOnlyOneTarget

    this.on('draw-start', e => this.onDrawStart(e))
    this.on('draw-move', e => this.onDrawMove(e))
    this.on('draw-end', e => this.onDrawEnd(e))
    this.on('draw-clear', e => this.onDrawClear(e))
  }

  //#endregion

  //#region 公有方法

  /** 清理绘制图形 */
  public clearDrawed () : this {
    this.fire('draw-clear')
    return this
  }

  /** 获取绘制的图元 */
  public getFeatures () : Feature[] {
    return this._features
  }

  /** 绘图开始处理事件 */
  public onDrawStart (e: OnDrawStartParams<this>) : OnDrawStartReture {
    if (!this.actived) {
      return false
    }
    return e.coordinate
  }
  /** 绘图过程处理事件 */
  public onDrawMove (e: OnDrawMoveParams<this>) : OnDrawMoveReture {
    if (!this.actived) {
      return false
    }
    const features = this.drawer_.setTemp(e.geometry, true) as Feature[]
    return features
  }
  /** 绘图结束处理事件 */
  public onDrawEnd (e: OnDrawEndParams<this>) : OnDrawEndReture {
    if (!this.actived) {
      return false
    }
    let features : Feature[]
    this._isDrawOnlyOneTarget
      ? features = this.drawer_.set(e.geometry, {}, true) as Feature[]
      : features = this.drawer_.add(e.geometry, {}, true) as Feature[]
    return features
  }
  /** 绘图清除处理事件 */
  public onDrawClear (e: OnDrawClearParams<this>) : OnDrawClearReture { // eslint-disable-line @typescript-eslint/no-unused-vars
    this.drawer_.clear()
    if (!this.actived) {
      return false
    }
    return true
  }

  /** 重写：工具激化处理事件 */
  onToolActived (e: OnToolActivedParams<this>) : OnToolActivedReture {
    if (!super.onToolActived(e)) {
      return false
    }
    this.map_.$owner.mapCursor.setCursor(this._cursorType)
    DrawTool[`_${this._drawType}`](this)
    return true
  }

  /** 重写：工具失活处理事件 */
  onToolDeActived (e: OnToolDeActivedParams<this>) : OnToolDeActivedReture {
    if (!super.onToolDeActived(e)) {
      return false
    }
    this.map_.$owner.mapCursor.setCursor('default')
    DrawTool._ClearDrawHandlers()
    return true
  }

  //#endregion

  //#region 私有静态属性

  /** 绘制动作响应事件池 */
  private static _handlerPool : { [key: string]: { remove() : void } | null } = {
    'click': null,
    'dblclick': null,
    'moveend': null,
    'movestart': null,
    'pointerdrag': null,
    'pointermove': null,
    'singleclick': null,
    'mousedown': null,
    'mouseup': null,
  }

  //#endregion

  //#region 私有静态方法

  /** 清理绘制动作响应事件 */
  private static _ClearDrawHandlers () {
    Object.entries(this._handlerPool).forEach(([key, item]) => {
      if (item) {
        item.remove()
        this._handlerPool[key] = null
      }
    })
    return this
  }

  /** 绘制点 */
  private static '_point' (drawTool: DrawTool) {
    this._ClearDrawHandlers()
    const handler = drawTool.map_.on('singleclick', ({ coordinate }) => {
      const geometry = createPoint(coordinate)
      drawTool.fire('draw-start', { coordinate })
      drawTool.fire('draw-end', { geometry })
    })
    const remove = () => unByKey(handler)
    this._handlerPool['singleclick'] = { remove }
  }

  /** 绘制直线段 */
  private static '_line' (drawTool: DrawTool) {
    this._ClearDrawHandlers()
    let drawing = false, startCoordinate: Coordinate | null = null
    const handlerStartAndEnd = drawTool.map_.on('singleclick', ({ coordinate }) => {
      if (drawing) {
        drawing = false
        const geometry = createLineString([startCoordinate, coordinate])
        startCoordinate = null
        drawTool.fire('draw-end', { geometry })
      } else {
        drawing = true
        startCoordinate = coordinate
        drawTool.fire('draw-start', { coordinate })
      }
    })
    const handlerMove = drawTool.map_.on('pointermove', e => {
      if (drawing && startCoordinate) {
        const geometry = createLineString([startCoordinate, e.coordinate])
        drawTool.fire('draw-move', { geometry })
      }
    })
    {
      const remove = () => unByKey(handlerStartAndEnd)
      this._handlerPool['singleclick'] = { remove }
    } {
      const remove = () => unByKey(handlerMove)
      this._handlerPool['pointermove'] = { remove }
    }
  }

  /** 快速绘制直线段 */
  private static '_line-faster' (drawTool: DrawTool) {
    this._ClearDrawHandlers()
    let drawing = false, startCoordinate: Coordinate | null = null
    const handlerMove = drawTool.map_.on('pointermove', (e) => {
      if (drawing) {
        const geometry = createLineString([startCoordinate, e.coordinate])
        drawTool.fire('draw-move', { geometry })
      }
      e.stopPropagation()
    })
    function handlerMousedown (e: MouseEvent) {
      if (e.button !== 0) {
        return
      }
      drawing = true
      startCoordinate = drawTool.map_.getEventCoordinate(e)
      drawTool.fire('draw-start', { coordinate: startCoordinate })
    }
    function handlerMouseup (e: MouseEvent) {
      if (e.button !== 0) {
        return
      }
      drawing = false
      const coordinate = drawTool.map_.getEventCoordinate(e)
      const geometry = createLineString([startCoordinate, coordinate])
      drawTool.fire('draw-end', { geometry })
    }
    drawTool.map_.getTargetElement().addEventListener('mousedown', handlerMousedown)
    drawTool.map_.getTargetElement().addEventListener('mouseup', handlerMouseup)
    {
      const remove = () => unByKey(handlerMove)
      this._handlerPool['pointermove'] = { remove }
    } {
      const remove = () => drawTool.map_.getTargetElement().removeEventListener('mousedown', handlerMousedown)
      this._handlerPool['mousedown'] = { remove }
    } {
      const remove = () => drawTool.map_.getTargetElement().removeEventListener('mouseup', handlerMouseup)
      this._handlerPool['mouseup'] = { remove }
    }
  }

  /** 绘制多段线 */
  private static '_polyline' (drawTool: DrawTool) {
    this._ClearDrawHandlers()
    let drawing = false
    const coordinates: Coordinate[] = []
    const handlerSingleClick = drawTool.map_.on('singleclick', ({ coordinate }) => {
      coordinates.push(coordinate)
      if (!drawing) {
        drawing = true
        drawTool.fire('draw-start', { coordinate })
      }
    }); {
      const remove = () => drawTool.map_.un('singleclick', handlerSingleClick.listener)
      this._handlerPool['singleclick'] = { remove }
    }
    const handlerDbClick = drawTool.map_.on('dblclick', e => {
      if (drawing) {
        e.stopPropagation()
        coordinates.push(e.coordinate)
        const geometry = createLineString(coordinates)
        drawing = false
        ext(coordinates).clear()
        drawTool.fire('draw-end', { geometry })
      }
    }); {
      const remove = () => unByKey(handlerDbClick)
      this._handlerPool['dbclick'] = { remove }
    }
    const handlerPointermove = drawTool.map_.on('pointermove', ({ coordinate }) => {
      if (drawing) {
        const geometry = createLineString([...coordinates, coordinate])
        drawTool.fire('draw-move', { geometry })
      }
    }); {
      const remove = () => unByKey(handlerPointermove)
      this._handlerPool['pointermove'] = { remove }
    }
  }

  /** 绘制面 */
  private static '_polygon' (drawTool: DrawTool) {
    this._ClearDrawHandlers()
    let drawing = false
    const coordinates: Coordinate[] = []
    const handlerSingleClick = drawTool.map_.on('singleclick', ({ coordinate }) => {
      coordinates.push(coordinate)
      if (!drawing) {
        drawing = true
        drawTool.fire('draw-start', { coordinate })
      }
    }); {
      const remove = () => unByKey(handlerSingleClick)
      this._handlerPool['singleclick'] = { remove }
    }
    const handlerDbClick = drawTool.map_.on('dblclick', e => {
      if (drawing) {
        e.stopPropagation()
        coordinates.push(e.coordinate)
        const geometry = createPolygon([coordinates])
        drawing = false
        ext(coordinates).clear()
        drawTool.fire('draw-end', { geometry })
      }
    }); {
      const remove = () => unByKey(handlerDbClick)
      this._handlerPool['dbclick'] = { remove }
    }
    const handlerPointermove = drawTool.map_.on('pointermove', ({ coordinate }) => {
      if (drawing) {
        const geometry = createPolygon([[...coordinates, coordinate]])
        drawTool.fire('draw-move', { geometry })
      }
    }); {
      const remove = () => unByKey(handlerPointermove)
      this._handlerPool['pointermove'] = { remove }
    }
  }

  /** 绘制矩形 */
  private static '_rectangle' (drawTool: DrawTool) {
    this._ClearDrawHandlers()
    let drawing = false, startX: number, startY: number
    const handlerStartAndEnd = drawTool.map_.on('singleclick', ({ coordinate }) => {
      if (drawing) {
        drawing = false
        const [endX, endY] = coordinate
        const coordinates = [[
          [startX, startY], [startX, endY],
          [endX, endY], [endX, startY],
        ]]
        const geometry = createPolygon(coordinates)
        ;[startX, startY] = [null, null]
        drawTool.fire('draw-end', { geometry })
      } else {
        drawing = true
        ;[startX, startY] = coordinate
        drawTool.fire('draw-start', { coordinate })
      }
    })
    const handlerMove = drawTool.map_.on('pointermove', e => {
      if (drawing) {
        const [endX, endY] = e.coordinate
        const coordinates = [[
          [startX, startY], [startX, endY],
          [endX, endY], [endX, startY],
        ]]
        const geometry = createPolygon(coordinates)
        drawTool.fire('draw-move', { geometry })
      }
    })
    {
      const remove = () => unByKey(handlerStartAndEnd)
      this._handlerPool['singleclick'] = { remove }
    } {
      const remove = () => unByKey(handlerMove)
      this._handlerPool['pointermove'] = { remove }
    }
  }

  /** 快速绘制矩形 */
  private static '_rectangle-faster' (drawTool: DrawTool) {
    this._ClearDrawHandlers()
    let drawing = false, startX: number, startY: number
    const handlerMove = drawTool.map_.on('pointermove', (e) => {
      if (drawing) {
        const [endX, endY] = e.coordinate
        const coordinates = [[
          [startX, startY], [startX, endY],
          [endX, endY], [endX, startY],
        ]]
        const geometry = createPolygon(coordinates)
        drawTool.fire('draw-move', { geometry })
      }
      e.stopPropagation()
    })
    function handlerMousedown (e: MouseEvent) {
      if (e.button !== 0) {
        return
      }
      drawing = true
      ;[startX, startY] = drawTool.map_.getEventCoordinate(e)
      drawTool.fire('draw-start', { coordinate: [startX, startY] })
    }
    function handlerMouseup (e: MouseEvent) {
      if (e.button !== 0) {
        return
      }
      drawing = false
      const [endX, endY] = drawTool.map_.getEventCoordinate(e)
      const coordinates = [[
        [startX, startY], [startX, endY],
        [endX, endY], [endX, startY],
      ]]
      const geometry = createPolygon(coordinates)
      drawTool.fire('draw-end', { geometry })
    }
    drawTool.map_.getTargetElement().addEventListener('mousedown', handlerMousedown)
    drawTool.map_.getTargetElement().addEventListener('mouseup', handlerMouseup)
    {
      const remove = () => unByKey(handlerMove)
      this._handlerPool['pointermove'] = { remove }
    } {
      const remove = () => drawTool.map_.getTargetElement().removeEventListener('mousedown', handlerMousedown)
      this._handlerPool['mousedown'] = { remove }
    } {
      const remove = () => drawTool.map_.getTargetElement().removeEventListener('mouseup', handlerMouseup)
      this._handlerPool['mouseup'] = { remove }
    }
  }

  /** 绘制圆 */
  private static '_circle' (drawTool: DrawTool) {
    this._ClearDrawHandlers()
    let drawing = false, startCoordinate: Coordinate | null = null
    const handlerStartAndEnd = drawTool.map_.on('singleclick', ({ coordinate }) => {
      if (drawing) {
        drawing = false
        const radius = distanceByTwoPoint(startCoordinate as [number, number], coordinate as [number, number])
        const geometry = createCircle(startCoordinate, radius)
        startCoordinate = null
        drawTool.fire('draw-end', { geometry })
      } else {
        drawing = true
        startCoordinate = coordinate
        drawTool.fire('draw-start', { coordinate })
      }
    })
    const handlerMove = drawTool.map_.on('pointermove', e => {
      if (drawing && startCoordinate) {
        const radius = distanceByTwoPoint(startCoordinate as [number, number], e.coordinate as [number, number])
        const geometry = createCircle(startCoordinate, radius)
        drawTool.fire('draw-move', { geometry })
      }
    })
    {
      const remove = () => unByKey(handlerStartAndEnd)
      this._handlerPool['singleclick'] = { remove }
    } {
      const remove = () => unByKey(handlerMove)
      this._handlerPool['pointermove'] = { remove }
    }
  }

  /** 快速绘制圆 */
  private static '_circle-faster' (drawTool: DrawTool) {
    this._ClearDrawHandlers()
    let drawing = false, startCoordinate: Coordinate | null = null
    const handlerMove = drawTool.map_.on('pointermove', (e) => {
      if (drawing) {
        const radius = distanceByTwoPoint(startCoordinate as [number, number], e.coordinate as [number, number])
        const geometry = createCircle(startCoordinate, radius)
        drawTool.fire('draw-move', { geometry })
      }
      e.stopPropagation()
    })
    function handlerMousedown (e: MouseEvent) {
      if (e.button !== 0) {
        return
      }
      drawing = true
      startCoordinate = drawTool.map_.getEventCoordinate(e)
      drawTool.fire('draw-start', { coordinate: startCoordinate })
    }
    function handlerMouseup (e: MouseEvent) {
      if (e.button !== 0) {
        return
      }
      drawing = false
      const coordinate = drawTool.map_.getEventCoordinate(e)
      const radius = distanceByTwoPoint(startCoordinate as [number, number], coordinate as [number, number])
      const geometry = createCircle(startCoordinate, radius)
      drawTool.fire('draw-end', { geometry })
    }
    drawTool.map_.getTargetElement().addEventListener('mousedown', handlerMousedown)
    drawTool.map_.getTargetElement().addEventListener('mouseup', handlerMouseup)
    {
      const remove = () => unByKey(handlerMove)
      this._handlerPool['pointermove'] = { remove }
    } {
      const remove = () => drawTool.map_.getTargetElement().removeEventListener('mousedown', handlerMousedown)
      this._handlerPool['mousedown'] = { remove }
    } {
      const remove = () => drawTool.map_.getTargetElement().removeEventListener('mouseup', handlerMouseup)
      this._handlerPool['mouseup'] = { remove }
    }
  }

  //#endregion

}

export default DrawTool

function distanceByTwoPoint (pt1: [number, number], pt2: [number, number]) : number {
  const [sx, sy] = pt1
  const [ex, ey] = pt2
  return ((ex - sx) ** 2 + (ey - sy) ** 2) ** .5
}
