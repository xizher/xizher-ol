import Layer from 'ol/layer/Layer';
import { IMap, IView } from '../../../../web-map/web-map';
import DrawTool, { OnDrawEndParams, OnDrawEndReture } from '../draw/draw-tool';
/**
 * HitTest工具类
 */
export declare class HitTestTool extends DrawTool<{}> {
    /** 目标图层集 */
    private _targetLayers;
    constructor(map: IMap, view: IView);
    setTargetLayers(layers: Layer[] | Layer): this;
    /** 绘制结束处理事件 */
    onDrawEnd(event: OnDrawEndParams<this>): OnDrawEndReture;
}
export default HitTestTool;
