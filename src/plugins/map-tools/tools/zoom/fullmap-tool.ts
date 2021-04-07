import { IMap, IView } from '../../../../web-map/web-map'
import BaseTool, { OnToolActivedParams, OnToolActivedReture } from '../../base-tool'

/**
 * 全图工具类
 */
export class FullmapTool extends BaseTool<{

}> {

  //#region 构造函数

  /**
   * 构造全图工具对象
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
    // TODO
    // const extent = this.map.$owner.layerOperation.getFullExtent()
    // if (extent) {
    //   this.view.fit(extent, { duration: 500 })
    // }
    return true
  }

  //#endregion

}

export default FullmapTool
