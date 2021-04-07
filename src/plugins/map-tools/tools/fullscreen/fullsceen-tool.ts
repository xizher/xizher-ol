import { IMap, IView } from '../../../../web-map/web-map'
import BaseTool, { OnToolActivedParams, OnToolActivedReture } from '../../base-tool'

/** 全屏工具类 */
export class FullscreenTool extends BaseTool<{

}> {

  //#region 构造函数

  /**
   * 构造全屏工具对象
   * @param map 地图对象
   * @param view 视图对象
   */
  constructor (map: IMap, view: IView) {
    super(map, view, true)
  }

  //#endregion

  //#region 私有属性

  /** 全屏 */
  private _fullscreen () {
    document.documentElement.requestFullscreen()
  }

  /** 关闭全屏 */
  private _cancelFullscreen () {
    document.exitFullscreen()
  }

  //#endregion

  //#region 公有属性

  onToolActived (e: OnToolActivedParams<this>) : OnToolActivedReture {
    if (!super.onToolActived(e)) {
      return false
    }
    if (document.fullscreen) {
      this._cancelFullscreen()
    } else {
      this._fullscreen()
    }
    return true
  }

  //#endregion

}

export default FullscreenTool
