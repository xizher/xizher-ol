import VectorLayer from 'ol/layer/Vector';
import DrawTool from '../draw/draw-tool';
/**
 * HitTest工具类
 */
export class HitTestTool extends DrawTool {
    //#endregion
    //#region 构造函数
    constructor(map, view) {
        super(map, view, { drawType: 'point' });
        //#region 私有方法
        /** 目标图层集 */
        this._targetLayers = [];
    }
    //#endregion
    //#region 公有方法
    setTargetLayers(layers) {
        this._targetLayers = Array.isArray(layers) ? layers : [layers];
        return this;
    }
    /** 绘制结束处理事件 */
    onDrawEnd(event) {
        const drawFeatures = super.onDrawEnd(event);
        if (!drawFeatures) {
            return false;
        }
        this.clearDrawed();
        const coordinates = drawFeatures[0].getGeometry().getCoordinates();
        const pixel = this.map.getPixelFromCoordinate(coordinates);
        let features = [];
        if (this._targetLayers.length === 0) {
            features = this.map.getFeaturesAtPixel(pixel);
        }
        else {
            this._targetLayers.forEach(layer => {
                if (layer instanceof VectorLayer) {
                    features = layer.getSource().getFeaturesAtCoordinate(coordinates);
                }
                // ...
            });
        }
        // const features = this.map.getFeaturesAtPixel(pixel) as Feature[]
        // console.log(features)
        return features;
    }
}
export default HitTestTool;
