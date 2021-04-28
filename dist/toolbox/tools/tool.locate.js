import ToolBase from '../tool.base';
/** 定位工具类 */
export class ToolLocate extends ToolBase {
    constructor() {
        //#region 私有属性
        super(...arguments);
        //#endregion
        //#region 公有属性
        this.zoomToLocationWhenDone = false;
        //#endregion
    }
    //#endregion
    //#region 保护方法
    /** 重写：工具执行过程触发事件 */
    onExecuting_(e) {
        super.onExecuting_(e);
        navigator.geolocation.getCurrentPosition(evt => {
            if (this.zoomToLocationWhenDone) {
                const { longitude, latitude } = evt.coords;
                this.webMap_.view.animate({
                    center: [longitude, latitude]
                });
            }
            this.fire('done', {
                success: true,
                result: evt
            });
        }, evt => {
            this.fire('done', {
                success: false,
                error: evt
            });
        }, { enableHighAccuracy: true });
    }
    onDone_(e) {
        super.onDone_(e);
        // console
    }
}
export default ToolLocate;
