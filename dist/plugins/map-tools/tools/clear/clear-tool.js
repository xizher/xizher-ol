import BaseTool from '../../base-tool';
/**
 * 清理图元工具类
 */
export class ClearTool extends BaseTool {
    //#region 构造函数
    /**
     * 构造清理图元工具对象
     * @param map 地图对象
     * @param view 视图对象
     */
    constructor(map, view) {
        super(map, view, true);
    }
    //#endregion
    //#region 公有方法
    /** 工具激化处理事件 */
    onToolActived(event) {
        if (!super.onToolActived(event)) {
            return false;
        }
        this.map.$owner.mapElementDisplay.clearAll();
        return true;
    }
}
export default ClearTool;
