import BaseTool from '../../base-tool';
/** 全屏工具类 */
export class FullscreenTool extends BaseTool {
    //#region 构造函数
    /**
     * 构造全屏工具对象
     * @param map 地图对象
     * @param view 视图对象
     */
    constructor(map, view) {
        super(map, view, true);
    }
    //#endregion
    //#region 私有属性
    /** 全屏 */
    _fullscreen() {
        document.documentElement.requestFullscreen();
    }
    /** 关闭全屏 */
    _cancelFullscreen() {
        document.exitFullscreen();
    }
    //#endregion
    //#region 公有属性
    onToolActived(e) {
        if (!super.onToolActived(e)) {
            return false;
        }
        if (document.fullscreen) {
            this._cancelFullscreen();
        }
        else {
            this._fullscreen();
        }
        return true;
    }
}
export default FullscreenTool;
