import { IMap, IView } from '../../../../web-map/web-map';
import BaseTool, { OnToolActivedParams, OnToolActivedReture } from '../../base-tool';
/**
 * 全图工具类
 */
export declare class FullmapTool extends BaseTool<{}> {
    /**
     * 构造全图工具对象
     * @param map 地图对象
     * @param view 视图对象
     */
    constructor(map: IMap, view: IView);
    /** 工具激化处理事件 */
    onToolActived(event: OnToolActivedParams<this>): OnToolActivedReture;
}
export default FullmapTool;
