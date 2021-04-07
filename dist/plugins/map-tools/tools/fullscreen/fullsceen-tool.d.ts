import { IMap, IView } from '../../../../web-map/web-map';
import BaseTool, { OnToolActivedParams, OnToolActivedReture } from '../../base-tool';
/** 全屏工具类 */
export declare class FullscreenTool extends BaseTool<{}> {
    /**
     * 构造全屏工具对象
     * @param map 地图对象
     * @param view 视图对象
     */
    constructor(map: IMap, view: IView);
    /** 全屏 */
    private _fullscreen;
    /** 关闭全屏 */
    private _cancelFullscreen;
    onToolActived(e: OnToolActivedParams<this>): OnToolActivedReture;
}
export default FullscreenTool;
