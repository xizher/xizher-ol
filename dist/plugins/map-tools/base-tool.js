import Observer from '@xizher/observer';
/** 基础工具类 */
export class BaseTool extends Observer {
    //#endregion
    //#region 构造函数
    /**
     * 构造基础工具对象
     * @param map 地图对象
     * @param view 视图对象
     * @param isOnceTool 是否为一次性工具，默认为否
     */
    constructor(map, view, isOnceTool = false) {
        super();
        /** 工具是否为激活状态 */
        this._actived = false;
        this._map = map;
        this._view = view;
        this._isOnceTool = isOnceTool;
        this.on('tool-actived', e => this.onToolActived(e));
        this.on('tool-deactived', e => this.onToolDeActived(e));
    }
    //#endregion
    //#region getter
    get map() {
        return this._map;
    }
    get view() {
        return this._view;
    }
    get isOnceTool() {
        return this._isOnceTool;
    }
    get actived() {
        return this._actived;
    }
    //#endregion
    //#region 公有方法
    /** 激活工具 */
    active() {
        if (this._actived) {
            return this;
        }
        this._actived = true;
        this.fire('tool-actived');
        if (this._isOnceTool) {
            this.deactive();
        }
        return this;
    }
    /** 接触工具激活状态 */
    deactive() {
        if (!this._actived) {
            return this;
        }
        this.fire('tool-deactived');
        return this;
    }
    /** 工具激化处理事件 */
    onToolActived(e) {
        if (!this._actived) {
            return false;
        }
        return true;
    }
    /** 工具失活处理事件 */
    onToolDeActived(e) {
        if (!this._actived) {
            return false;
        }
        this._actived = false;
        return true;
    }
}
export default BaseTool;
