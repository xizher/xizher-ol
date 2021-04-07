import Observer, { IObserverCallbackParams } from '@xizher/observer';
import { IMap, IView } from '../../web-map/web-map';
export declare type OnToolActivedParams<T> = IObserverCallbackParams<'tool-actived', T>;
export declare type OnToolDeActivedParams<T> = IObserverCallbackParams<'tool-deactived', T>;
export declare type OnToolActivedReture = boolean;
export declare type OnToolDeActivedReture = boolean;
/** 基础工具类 */
export declare class BaseTool<T> extends Observer<T & {
    'tool-actived': void;
    'tool-deactived': void;
}> {
    /** 是否为一次性工具 */
    private _isOnceTool;
    /** 工具是否为激活状态 */
    private _actived;
    /** 地图对象 */
    protected map_: IMap;
    /** 视图对象 */
    protected view_: IView;
    get isOnceTool(): boolean;
    get actived(): boolean;
    /**
     * 构造基础工具对象
     * @param map 地图对象
     * @param view 视图对象
     * @param isOnceTool 是否为一次性工具，默认为否
     */
    constructor(map: IMap, view: IView, isOnceTool?: boolean);
    /** 激活工具 */
    active(): this;
    /** 接触工具激活状态 */
    deactive(): this;
    /** 工具激化处理事件 */
    onToolActived(e: OnToolActivedParams<this>): OnToolActivedReture;
    /** 工具失活处理事件 */
    onToolDeActived(e: OnToolDeActivedParams<this>): OnToolDeActivedReture;
}
export default BaseTool;
