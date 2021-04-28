import Observer from '@xizher/observer';
/** 基础工具类 */
export class ToolBase extends Observer {
    //#endregion
    //#region 构造函数
    /**
     * 初始化基础工具类
     * @param webMap WebMap对象
     */
    constructor(webMap) {
        super();
        this.webMap_ = webMap;
        this.on('reset', e => this.onReset_(e));
        this.on('done', e => this.onDone_(e));
        this.on('executing', e => this.onExecuting_(e));
    }
    //#endregion
    //#region 保护方法
    /** 工具重置触发事件 */
    onReset_(e) {
        // ...
    }
    /** 工具执行完成触发事件 */
    onDone_(e) {
        document.body.style.cursor = 'default';
    }
    /** 工具执行过程触发事件 */
    onExecuting_(e) {
        document.body.style.cursor = 'wait';
        // ...
    }
    //#endregion
    //#region 公有方法
    reset() {
        this.fire('reset');
    }
    execute() {
        this.fire('executing');
    }
}
export default ToolBase;
