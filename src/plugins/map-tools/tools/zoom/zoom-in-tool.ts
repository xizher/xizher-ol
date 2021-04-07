import { IMap, IView } from '../../../../web-map/web-map'
import BaseTool, { OnToolActivedParams, OnToolActivedReture } from '../../base-tool'

/**
 * 放大工具类
 */
export class ZoomInTool extends BaseTool<{

}> {

  //#region 构造函数

  /**
   * 构造放大工具对象
   * @param map 地图对象
   * @param view 视图对象
   */
  constructor (map: IMap, view: IView) {
    super(map, view, true)
  }

  //#endregion

  //#region 公有方法

  /** 工具激化处理事件 */
  onToolActived (event: OnToolActivedParams<this>) : OnToolActivedReture {
    if (!super.onToolActived(event)) {
      return false
    }
    const zoom = this.view_.getZoom() + 1
    this.view_.animate({
      zoom, duration: 500
    })
    return true
  }

  //#endregion

}

export default ZoomInTool
