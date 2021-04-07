import Geometry from 'ol/geom/Geometry';
import { IObserverCallbackParams } from '@xizher/observer';
import { IMap, IView } from '../../../../web-map/web-map';
import { MapCursorType } from '../../../map-cursor/map-cursor';
import BaseTool, { OnToolActivedParams, OnToolActivedReture, OnToolDeActivedParams, OnToolDeActivedReture } from '../../base-tool';
import Drawer from './drawer';
import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
export declare type DrawType = 'point' | 'line' | 'line-faster' | 'polyline' | 'polygon' | 'rectangle' | 'rectangle-faster' | 'circle' | 'circle-faster';
export declare type OnDrawStartParams<T> = IObserverCallbackParams<'draw-start', T> & {
    coordinate: Coordinate;
};
export declare type OnDrawMoveParams<T> = IObserverCallbackParams<'draw-move', T> & {
    geometry: Geometry;
};
export declare type OnDrawEndParams<T> = IObserverCallbackParams<'draw-end', T> & {
    geometry: Geometry;
};
export declare type OnDrawClearParams<T> = IObserverCallbackParams<'draw-clear', T>;
export declare type OnDrawStartReture = Coordinate | false;
export declare type OnDrawMoveReture = Feature[] | false;
export declare type OnDrawEndReture = Feature[] | false;
export declare type OnDrawClearReture = boolean;
export interface DrawToolOptions {
    drawType?: DrawType;
    cursorType?: MapCursorType;
    isDrawOnlyOneTarget?: boolean;
}
/** 绘图工具 */
export declare class DrawTool<T = {}> extends BaseTool<T & {
    'draw-start': {
        coordinate: Coordinate;
    };
    'draw-move': {
        geometry: Geometry;
    };
    'draw-end': {
        geometry: Geometry;
    };
    'draw-clear': {};
}> {
    /** 绘图类型 */
    private _drawType;
    /** 鼠标样式 */
    private _cursorType;
    /** 是否只绘制单一目标 */
    private _isDrawOnlyOneTarget;
    /** 记录当前存在的绘制图元 */
    private _features;
    /** 绘图器对象 */
    protected drawer_: Drawer;
    get isDrawOneTarget(): boolean;
    set isDrawOneTarget(b: boolean);
    /**
     * 构造绘图工具对象
     * @param map 地图对象
     * @param view 视图对象
     * @param drawType 绘图类型
     * @param cursorType 鼠标类型
     */
    constructor(map: IMap, view: IView, options?: DrawToolOptions);
    /** 清理绘制图形 */
    clearDrawed(): this;
    /** 获取绘制的图元 */
    getFeatures(): Feature[];
    /** 绘图开始处理事件 */
    onDrawStart(e: OnDrawStartParams<this>): OnDrawStartReture;
    /** 绘图过程处理事件 */
    onDrawMove(e: OnDrawMoveParams<this>): OnDrawMoveReture;
    /** 绘图结束处理事件 */
    onDrawEnd(e: OnDrawEndParams<this>): OnDrawEndReture;
    /** 绘图清除处理事件 */
    onDrawClear(e: OnDrawClearParams<this>): OnDrawClearReture;
    /** 重写：工具激化处理事件 */
    onToolActived(e: OnToolActivedParams<this>): OnToolActivedReture;
    /** 重写：工具失活处理事件 */
    onToolDeActived(e: OnToolDeActivedParams<this>): OnToolDeActivedReture;
    /** 绘制动作响应事件池 */
    private static _handlerPool;
    /** 清理绘制动作响应事件 */
    private static _ClearDrawHandlers;
    /** 绘制点 */
    private static '_point';
    /** 绘制直线段 */
    private static '_line';
    /** 快速绘制直线段 */
    private static '_line-faster';
    /** 绘制多段线 */
    private static '_polyline';
    /** 绘制面 */
    private static '_polygon';
    /** 绘制矩形 */
    private static '_rectangle';
    /** 快速绘制矩形 */
    private static '_rectangle-faster';
    /** 绘制圆 */
    private static '_circle';
    /** 快速绘制圆 */
    private static '_circle-faster';
}
export default DrawTool;
