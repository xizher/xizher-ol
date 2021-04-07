import { Feature } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import { IMap, IView } from '../../../../web-map/web-map';
import BaseTool, { OnToolActivedParams, OnToolActivedReture, OnToolDeActivedParams, OnToolDeActivedReture } from '../../base-tool';
import './measure-tool.css';
export declare type MeasureType = 'area' | 'length' | '';
/** 测量工具类 */
export declare class MeasureTool extends BaseTool<{
    'change:type': {
        type: MeasureType;
    };
}> {
    private static _MSG_START_TO_DRAW;
    private static _MSG_CONTIUNE_POLYLINE;
    private static _MSG_CONTIUNE_POLYGON;
    /** 测量要素 */
    private _feature;
    /** 提示层DOM元素 */
    private _helpTooltipElement;
    /** 提示层对象 */
    private _helpTooltip;
    /** 鼠标移动处理事件 */
    private _handlerMousemove;
    /** 鼠标离开处理事件 */
    private _handlerMouseout;
    /** 测量信息DOM元素 */
    private _measureTooltipElement;
    /** 测量信息层对象 */
    private _measureTooltip;
    private _measureTooltipPool;
    /** 测量矢量数据源 */
    private _source;
    /** 测量矢量图层 */
    private _vectorLayer;
    /** 绘制器 */
    private _draw;
    /** 测量方式 */
    private _measureType;
    get type(): MeasureType;
    get layer(): VectorLayer;
    /**
     * 构造测量工具类
     * @param map 地图对象
     * @param view 视图对象
     */
    constructor(map: IMap, view: IView);
    private _init;
    /** 创建绘图工具 */
    private _createDraw;
    private _createMousemoveHandler;
    private _createMouseoutHandler;
    /** 创建帮助提醒 */
    private _createHelpTooltip;
    /** 创建测量提醒 */
    private _createMeasureTooltip;
    /**
     * 计算面积
     * @param polygon 面对象
     */
    private _formatArea;
    /**
     * 计算长度
     * @param line 线对象
     */
    private _formatLength;
    /** 清理测量信息 */
    clearMeasure(): this;
    /**
     * 移除测量信息
     * @param feature 测量要素
     */
    removeMeasure(feature: Feature): this;
    /** 设置测量类型 */
    setMeasureType(type: MeasureType): this;
    /** 工具激化处理事件 */
    onToolActived(e: OnToolActivedParams<this>): OnToolActivedReture;
    /** 工具失活处理事件 */
    onToolDeActived(e: OnToolDeActivedParams<this>): OnToolDeActivedReture;
}
export default MeasureTool;
