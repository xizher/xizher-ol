import { Feature } from 'ol'
import { Point } from 'ol/geom'
import Layer from 'ol/layer/Layer'
import VectorLayer from 'ol/layer/Vector'
import { IMap, IView } from '../../../../web-map/web-map'
import DrawTool, { OnDrawEndParams, OnDrawEndReture } from '../draw/draw-tool'

/**
 * HitTest工具类
 */
export class HitTestTool extends DrawTool<{

}> {

  //#region 私有方法

  /** 目标图层集 */
  private _targetLayers : Layer[] = []

  //#endregion

  //#region 构造函数

  constructor (map: IMap, view: IView) {
    super(map, view, { drawType: 'point' })
  }

  //#endregion

  //#region 公有方法

  setTargetLayers (layers: Layer[] | Layer) : this {
    this._targetLayers = Array.isArray(layers) ? layers : [layers]
    return this
  }

  /** 绘制结束处理事件 */
  onDrawEnd (event: OnDrawEndParams<this>) : OnDrawEndReture {
    const drawFeatures = super.onDrawEnd(event)
    if (!drawFeatures) {
      return false
    }
    this.clearDrawed()
    const coordinates = (drawFeatures[0].getGeometry() as Point).getCoordinates()
    const pixel = this.map_.getPixelFromCoordinate(coordinates)
    let features : Feature[] = []
    if (this._targetLayers.length === 0) {
      features = this.map_.getFeaturesAtPixel(pixel) as Feature[]
    } else {
      this._targetLayers.forEach(layer => {
        if (layer instanceof VectorLayer) {
          features = layer.getSource().getFeaturesAtCoordinate(coordinates)
        }
        // ...
      })
    }
    // const features = this.map.getFeaturesAtPixel(pixel) as Feature[]
    // console.log(features)
    return features
  }

  //#endregion

}

export default HitTestTool
