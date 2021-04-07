import { Select } from 'ol/interaction';
import BaseTool from '../../base-tool';
/**
 * 测量清理工具类
 */
export class MeasureRemoveTool extends BaseTool {
    //#endregion
    //#region 构造函数
    /**
     * 构造标记清理工具对象
     * @param map 地图对象
     * @param view 视图对象
     */
    constructor(map, view, measureTool) {
        super(map, view, false);
        /** 鼠标样式 */
        this._cursorType = 'clear';
        this._measureTool = measureTool;
        this._select = new Select({
            layers: [measureTool.layer]
        });
    }
    //#endregion
    //#region 公有方法
    /** 工具激化处理事件 */
    onToolActived(event) {
        if (!super.onToolActived(event)) {
            return false;
        }
        this.map.addInteraction(this._select);
        this.map.$owner.mapCursor.setCursor(this._cursorType);
        this._handlerMousedown = () => {
            const features = this._select.getFeatures();
            features.forEach(feat => this._measureTool.removeMeasure(feat));
        };
        this.map.getTargetElement().addEventListener('mousedown', this._handlerMousedown);
        this._handlerMousemove = (e) => {
            const pixel = this.map.getEventPixel(e);
            const [feature] = this.map.getFeaturesAtPixel(pixel, {
                layerFilter: layer => layer === this._measureTool.layer
            });
            this._select.getFeatures().clear();
            feature && this._select.getFeatures().push(feature);
        };
        this.map.getTargetElement().addEventListener('mousemove', this._handlerMousemove);
        return true;
    }
    /** 工具失活处理事件 */
    onToolDeActived(e) {
        if (!super.onToolDeActived(e)) {
            return false;
        }
        this.map.removeInteraction(this._select);
        this.map.$owner.mapCursor.setCursor('default');
        this.map.getTargetElement().removeEventListener('mousedown', this._handlerMousedown);
        this.map.getTargetElement().removeEventListener('mousemove', this._handlerMousemove);
        return true;
    }
}
export default MeasureRemoveTool;
