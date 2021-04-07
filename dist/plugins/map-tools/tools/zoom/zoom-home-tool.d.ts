import { Coordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';
import { IMap, IView } from '../../../../web-map/web-map';
import BaseTool, { OnToolActivedParams, OnToolActivedReture } from '../../base-tool';
export declare type ICenterZoom = {
    center: Coordinate | [number | number];
    zoom: number;
};
/**
 * 返回起始位置工具类
 */
export declare class ZoomHomeTool extends BaseTool<{}> {
    private _homeExtent;
    /**
     * 构造返回起始位置工具对象
     * @param map 地图对象
     * @param view 视图对象
     */
    constructor(map: IMap, view: IView);
    /** 设置初始范围 */
    setHomeZoom(extent: Extent): this;
    /** 工具激化处理事件 */
    onToolActived(event: OnToolActivedParams<this>): OnToolActivedReture;
}
export default ZoomHomeTool;
