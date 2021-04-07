import { IMap, IView } from '../../../../web-map/web-map';
import BaseTool, { OnToolActivedParams, OnToolActivedReture, OnToolDeActivedParams, OnToolDeActivedReture } from '../../base-tool';
import MarkTool from './mark-tool';
/**
 * 标记清理工具类
 */
export declare class MarkRemoveTool extends BaseTool<{}> {
    /** 清理标记处理事件 */
    private _handlerMousedown;
    /** 清理标记处理事件 */
    private _handlerMousemove;
    /** 选择工具 */
    private _select;
    /** 标记工具对象 */
    private _markTool;
    /** 鼠标样式 */
    private _cursorType;
    /**
     * 构造标记清理工具对象
     * @param map 地图对象
     * @param view 视图对象
     */
    constructor(map: IMap, view: IView, markTool: MarkTool);
    /** 工具激化处理事件 */
    onToolActived(event: OnToolActivedParams<this>): OnToolActivedReture;
    /** 工具失活处理事件 */
    onToolDeActived(e: OnToolDeActivedParams<this>): OnToolDeActivedReture;
}
export default MarkRemoveTool;
