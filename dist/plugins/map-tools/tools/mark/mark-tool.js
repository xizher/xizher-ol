import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Modify, Draw, Snap } from 'ol/interaction';
import BaseTool from '../../base-tool';
/** 标记工具类 */
export class MarkTool extends BaseTool {
    //#endregion
    //#region 构造函数
    /**
     * 构造标记工具对象
     * @param map 地图对象
     * @param view 视图对象
     */
    constructor(map, view) {
        super(map, view, false);
        /** 标记类型 */
        this._markType = 'Point';
        this._init();
        this.on('mark-clear', e => this.onMarkClear(e));
    }
    //#endregion
    //#region getter
    get layer() {
        return this._vectorLayer;
    }
    get markType() {
        return this._markType;
    }
    //#endregion
    //#region 私有方法
    /** 初始化 */
    _init() {
        this._source = new VectorSource();
        this._vectorLayer = new VectorLayer({ source: this._source });
        this._modify = new Modify({ source: this._source });
        this._snap = new Snap({ source: this._source });
        this._createDraw();
    }
    /** 创建绘图工具 */
    _createDraw() {
        this._draw = new Draw({
            source: this._source,
            type: this._markType,
        });
        return this._draw;
    }
    //#endregion
    //#region 公有方法
    /** 清理标记 */
    clearMark() {
        this.fire('mark-clear');
        return this;
    }
    /**
     * 清理指定标记
     * @param feature 标记要素
     */
    removeMark(feature) {
        this._source.removeFeature(feature);
        return this;
    }
    /**
     * 设置标记类型
     * @param type 标记类型
     */
    setMarkType(type) {
        this._markType = type;
        this.fire('change:mark-type', { type });
        if (this.actived) {
            this.map_.removeInteraction(this._draw);
            this.map_.addInteraction(this._createDraw());
        }
        else {
            this._createDraw();
        }
        return this;
    }
    /** 工具激化处理事件 */
    onToolActived(e) {
        if (!super.onToolActived(e)) {
            return false;
        }
        this.map_.getLayers().remove(this._vectorLayer);
        this.map_.addLayer(this._vectorLayer);
        this.map_.addInteraction(this._modify);
        this.map_.addInteraction(this._draw);
        this.map_.addInteraction(this._snap);
        return true;
    }
    /** 工具失活处理事件 */
    onToolDeActived(e) {
        if (!super.onToolDeActived(e)) {
            return false;
        }
        this.map_.removeInteraction(this._modify);
        this.map_.removeInteraction(this._draw);
        this.map_.removeInteraction(this._snap);
        return true;
    }
    /** 清理注记处理事件 */
    onMarkClear(e) {
        this._source.clear();
        if (!this.actived) {
            return false;
        }
        return true;
    }
}
export default MarkTool;
