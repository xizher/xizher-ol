import { IMap, IView } from '../../../../web-map/web-map'
import DrawTool, { OnDrawEndParams, OnDrawEndReture } from '../draw/draw-tool'

/** 拉框缩小工具类 */
export class ZoomOutRectTool extends DrawTool {

  //#region 构造函数

  /**
   * 构造拉框缩小工具对象
   * @param map 地图对象
   * @param view 视图对象
   */
  constructor (map: IMap, view: IView) {
    super(map, view, {
      drawType: 'rectangle-faster',
      cursorType: 'zoomout'
    })

    this.drawer_.setDrawingStyle({
      polygonStyle: {
        fill: { color: 'rgba(0, 0, 0, 0.5)' },
        stroke: { color: 'rgba(0, 0, 0, 0.8)' },
      }
    })
  }

  //#endregion

  //#region 公有方法

  /** 重写：绘图过程处理事件 */
  onDrawEnd (e: OnDrawEndParams<this>) : OnDrawEndReture {
    const result = super.onDrawEnd(e)
    if (result) {
      this.clearDrawed()
      const [feature] = result
      const [gXmin, gYmin, gXmax, gYmax] = feature.getGeometry().getExtent()
      const [vXmin, vYmin, vXmax, vYmax] = this.view_.calculateExtent()
      const [gWidth, gHeight] = [gXmax - gXmin, gYmax, gYmin]
      const [vWidth, vHeight] = [vXmax - vXmin, vYmax - vYmin]
      const nWidth = vWidth ** 2 / gWidth
      const nHeight = vHeight ** 2 / gHeight
      const nXmin = vXmin - ((gXmin - vXmin) * vWidth / gWidth)
      const nYmin = vYmin - ((gYmin - vYmin) * vHeight / gHeight)
      const nXmax = nXmin + Math.abs(nWidth)
      const nYMax = nYmin + Math.abs(nHeight)
      this.view_.fit([nXmin, nYmin, nXmax, nYMax], { duration: 500 })
    }
    return result
  }

  //#endregion

}

export default ZoomOutRectTool
