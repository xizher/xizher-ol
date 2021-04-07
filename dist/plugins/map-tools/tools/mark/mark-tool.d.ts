import VectorLayer from 'ol/layer/Vector';
import BaseTool, { OnToolActivedParams, OnToolActivedReture, OnToolDeActivedParams, OnToolDeActivedReture } from '../../base-tool';
import { IMap, IView } from '../../../../web-map/web-map';
import { IObserverCallbackParams } from '@xizher/observer';
import { Feature } from 'ol';
export declare type OnMarkClearParams<T> = IObserverCallbackParams<'mark-clear', T>;
export declare type OnMarkClearReture = boolean;
export declare type MarkGeometryType = 'Point' | 'LineString' | 'Polygon' | 'Circle';
/** 标记工具类 */
export declare class MarkTool extends BaseTool<{
    'mark-clear': void;
    'change:mark-type': {
        type: MarkGeometryType;
    };
}> {
    /** 矢量数据源 */
    private _source;
    /** 矢量图层 */
    private _vectorLayer;
    /** 修改工具 */
    private _modify;
    /** 绘图工具 */
    private _draw;
    /** 编辑工具 */
    private _snap;
    /** 标记类型 */
    private _markType;
    get layer(): VectorLayer;
    get markType(): MarkGeometryType;
    /**
     * 构造标记工具对象
     * @param map 地图对象
     * @param view 视图对象
     */
    constructor(map: IMap, view: IView);
    /** 初始化 */
    private _init;
    /** 创建绘图工具 */
    private _createDraw;
    /** 清理标记 */
    clearMark(): this;
    /**
     * 清理指定标记
     * @param feature 标记要素
     */
    removeMark(feature: Feature): this;
    /**
     * 设置标记类型
     * @param type 标记类型
     */
    setMarkType(type: MarkGeometryType): this;
    /** 工具激化处理事件 */
    onToolActived(e: OnToolActivedParams<this>): OnToolActivedReture;
    /** 工具失活处理事件 */
    onToolDeActived(e: OnToolDeActivedParams<this>): OnToolDeActivedReture;
    /** 清理注记处理事件 */
    onMarkClear(e: OnMarkClearParams<this>): OnMarkClearReture;
}
export default MarkTool;
