import BaseTool from '../../base-tool';
/**
 * 返回起始位置工具类
 */
export class ZoomHomeTool extends BaseTool {
    //#endregion
    //#region 构造函数
    /**
     * 构造返回起始位置工具对象
     * @param map 地图对象
     * @param view 视图对象
     */
    constructor(map, view) {
        super(map, view, true);
        this._homeExtent = {
            center: view.getCenter(),
            zoom: view.getZoom(),
        };
    }
    //#endregion
    //#region 公有方法
    /** 设置初始范围 */
    setHomeZoom(extent) {
        this._homeExtent = extent;
        return this;
    }
    /** 工具激化处理事件 */
    onToolActived(event) {
        if (!super.onToolActived(event)) {
            return false;
        }
        if (Array.isArray(this._homeExtent)) {
            this.view.fit(this._homeExtent, {
                duration: 500
            });
        }
        else {
            this.view.animate({
                ...this._homeExtent, duration: 500
            });
        }
        return true;
    }
}
export default ZoomHomeTool;
