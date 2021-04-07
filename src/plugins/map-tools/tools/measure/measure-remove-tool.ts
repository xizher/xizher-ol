import { Feature } from 'ol'
import { Select } from 'ol/interaction'
import { IMap, IView } from '../../../../web-map/web-map'
import { MapCursorType } from '../../../map-cursor/map-cursor'
import BaseTool, { OnToolActivedParams, OnToolActivedReture, OnToolDeActivedParams, OnToolDeActivedReture } from '../../base-tool'
import MeasureTool from './measure-tool'

/**
 * 测量清理工具类
 */
export class MeasureRemoveTool extends BaseTool<{

}> {

  //#region 私有属性

  /** 清理标记处理事件 */
  private _handlerMousedown: (e: MouseEvent) => void

  /** 清理标记处理事件 */
  private _handlerMousemove: (e: MouseEvent) => void

  /** 选择工具 */
  private _select: Select

  /** 标记工具对象 */
  private _measureTool: MeasureTool

  /** 鼠标样式 */
  private _cursorType: MapCursorType = 'clear'

  //#endregion

  //#region 构造函数

  /**
   * 构造标记清理工具对象
   * @param map 地图对象
   * @param view 视图对象
   */
  constructor (map: IMap, view: IView, measureTool: MeasureTool) {
    super(map, view, false)

    this._measureTool = measureTool
    this._select = new Select({
      layers : [measureTool.layer]
    })
  }

  //#endregion

  //#region 公有方法

  /** 工具激化处理事件 */
  onToolActived (event: OnToolActivedParams<this>) : OnToolActivedReture {
    if (!super.onToolActived(event)) {
      return false
    }
    this.map.addInteraction(this._select)
    this.map.$owner.mapCursor.setCursor(this._cursorType)
    this._handlerMousedown = () => {
      const features = this._select.getFeatures()
      features.forEach(feat => this._measureTool.removeMeasure(feat))
    }
    this.map.getTargetElement().addEventListener('mousedown', this._handlerMousedown)
    this._handlerMousemove = (e: MouseEvent) => {
      const pixel = this.map.getEventPixel(e)
      const [feature] = this.map.getFeaturesAtPixel(pixel, {
        layerFilter: layer => layer === this._measureTool.layer
      }) as Feature[]
      this._select.getFeatures().clear()
      feature && this._select.getFeatures().push(feature)
    }
    this.map.getTargetElement().addEventListener('mousemove', this._handlerMousemove)
    return true
  }

  /** 工具失活处理事件 */
  onToolDeActived (e: OnToolDeActivedParams<this>) : OnToolDeActivedReture {
    if (!super.onToolDeActived(e)) {
      return false
    }
    this.map.removeInteraction(this._select)
    this.map.$owner.mapCursor.setCursor('default')
    this.map.getTargetElement().removeEventListener('mousedown', this._handlerMousedown)
    this.map.getTargetElement().removeEventListener('mousemove', this._handlerMousemove)
    return true
  }

  //#endregion

}

export default MeasureRemoveTool
