import Observer, { IObserverCallbackParams } from '@xizher/observer';
import WebMap from '../web-map/web-map';
export declare type OnResetParams<T> = IObserverCallbackParams<'reset', T>;
export declare type OnDoneParams<T> = IObserverCallbackParams<'done', T>;
export declare type OnExecutingParams<T> = IObserverCallbackParams<'executing', T>;
export interface IToolBaseEvent<T> {
    'reset': void;
    'done': {
        success: true;
        result: T;
    } | {
        success: false;
        error: unknown;
    };
    'executing': void;
}
/** 基础工具类 */
export declare class ToolBase<T extends IToolBaseEvent<unknown>> extends Observer<T & IToolBaseEvent<unknown>> {
    /** WebMap对象 */
    protected webMap_: WebMap;
    /**
     * 初始化基础工具类
     * @param webMap WebMap对象
     */
    constructor(webMap: WebMap);
    /** 工具重置触发事件 */
    protected onReset_(e: OnResetParams<this>): void;
    /** 工具执行完成触发事件 */
    protected onDone_(e: OnDoneParams<this>): void;
    /** 工具执行过程触发事件 */
    protected onExecuting_(e: OnExecutingParams<this>): void;
    reset(): void;
    execute(): void;
}
export default ToolBase;
