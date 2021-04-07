import { Overlay } from 'ol';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import { Draw } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import { unByKey } from 'ol/Observable';
import VectorSource from 'ol/source/Vector';
import { createStyle2 } from '../../../../utilities/style.utilities';
import BaseTool from '../../base-tool';
import './measure-tool.css';
/** 测量工具类 */
export class MeasureTool extends BaseTool {
    //#endregion
    //#region 构造函数
    /**
     * 构造测量工具类
     * @param map 地图对象
     * @param view 视图对象
     */
    constructor(map, view) {
        super(map, view, false);
        this._measureTooltipPool = new Map();
        /** 测量方式 */
        this._measureType = 'length';
        this._init();
    }
    //#endregion
    //#region getter
    get type() {
        return this._measureType;
    }
    get layer() {
        return this._vectorLayer;
    }
    //#endregion
    //#region 私有方法
    _init() {
        this._source = new VectorSource();
        this._vectorLayer = new VectorLayer({
            source: this._source,
            style: createStyle2({
                fill: { color: 'rgba(255, 255, 255, 0.2)' },
                stroke: {
                    color: '#ffcc33',
                    width: 2,
                },
                image: {
                    styleType: 'circle',
                    radius: 7,
                    fill: { color: '#ffcc33', }
                },
            }),
        });
        this._createMousemoveHandler();
        this._createMouseoutHandler();
    }
    /** 创建绘图工具 */
    _createDraw() {
        this._draw = new Draw({
            source: this._source,
            type: (this._measureType === 'area' ? 'Polygon' : 'LineString'),
            style: createStyle2({
                fill: { color: 'rgba(255, 255, 255, 0.2)' },
                stroke: {
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2,
                },
                image: {
                    styleType: 'circle',
                    radius: 5,
                    stroke: { color: 'rgba(0, 0, 0, 0.7)' },
                    fill: { color: 'rgba(255, 255, 255, 0.2)' },
                },
            }),
        });
        let listener;
        this._draw.on('drawstart', event => {
            this._feature = event.feature;
            let tooltipCoordinate;
            listener = this._feature.getGeometry().on('change', evt => {
                const geometry = evt.target;
                let output = '';
                if (geometry instanceof Polygon) {
                    output = this._formatArea(geometry);
                    tooltipCoordinate = geometry.getInteriorPoint().getCoordinates();
                }
                else if (geometry instanceof LineString) {
                    output = this._formatLength(geometry);
                    tooltipCoordinate = geometry.getLastCoordinate();
                }
                this._measureTooltipElement.innerHTML = output;
                this._measureTooltip.setPosition(tooltipCoordinate);
            });
        });
        this._draw.on('drawend', () => {
            this._measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
            this._measureTooltip.setOffset([0, -7]);
            this._measureTooltipPool.set(this._feature, this._measureTooltip);
            this._feature = null;
            this._measureTooltipElement = null;
            this._createMeasureTooltip();
            unByKey(listener);
        });
        return this._draw;
    }
    _createMousemoveHandler() {
        this._handlerMousemove = e => {
            if (e.dragging) {
                return;
            }
            let msg = MeasureTool._MSG_START_TO_DRAW;
            if (this._feature) {
                const geom = this._feature.getGeometry();
                if (geom instanceof Polygon) {
                    msg = MeasureTool._MSG_CONTIUNE_POLYGON;
                }
                else {
                    msg = MeasureTool._MSG_CONTIUNE_POLYLINE;
                }
            }
            this._helpTooltipElement.innerHTML = msg;
            this._helpTooltip.setPosition(e.coordinate);
            this._helpTooltipElement.classList.remove('hidden');
        };
        return this._handlerMousemove;
    }
    _createMouseoutHandler() {
        this._handlerMouseout = () => {
            this._helpTooltipElement.classList.add('hidden');
        };
        return this._handlerMouseout;
    }
    /** 创建帮助提醒 */
    _createHelpTooltip() {
        if (this._helpTooltipElement) {
            this._helpTooltipElement.parentNode.removeChild(this._helpTooltipElement);
        }
        this._helpTooltipElement = document.createElement('div');
        this._helpTooltipElement.className = 'ol-tooltip hidden';
        this._helpTooltip = new Overlay({
            element: this._helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left',
        });
        this.map.addOverlay(this._helpTooltip);
    }
    /** 创建测量提醒 */
    _createMeasureTooltip() {
        if (this._measureTooltipElement) {
            this._measureTooltipElement.parentNode.removeChild(this._measureTooltipElement);
        }
        this._measureTooltipElement = document.createElement('div');
        this._measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
        this._measureTooltip = new Overlay({
            element: this._measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center',
        });
        this.map.addOverlay(this._measureTooltip);
    }
    /**
     * 计算面积
     * @param polygon 面对象
     */
    _formatArea(polygon) {
        const area = polygon.getArea();
        if (area > 10000) {
            return `${Math.round((area / 1000000) * 100) / 100}km<sup>2</sup>`;
        }
        return `${Math.round(area * 100) / 100}m<sup>2</sup>`;
    }
    /**
     * 计算长度
     * @param line 线对象
     */
    _formatLength(line) {
        const length = line.getLength();
        if (length > 100) {
            return `${Math.round((length / 1000) * 100) / 100}km`;
        }
        return `${Math.round(length * 100) / 100}m`;
    }
    //#endregion
    //#region 公有方法
    /** 清理测量信息 */
    clearMeasure() {
        // this._measureTooltipPool.forEach(item => {
        //   this.map.removeOverlay(item)
        // })
        // ext(this._measureTooltipPool).clear()
        this._measureTooltipPool.forEach(overlay => {
            this.map.removeOverlay(overlay);
        });
        this._measureTooltipPool.clear();
        this._source.clear();
        return this;
    }
    /**
     * 移除测量信息
     * @param feature 测量要素
     */
    removeMeasure(feature) {
        const overlay = this._measureTooltipPool.get(feature);
        this.map.removeOverlay(overlay);
        this._source.removeFeature(feature);
        this._measureTooltipPool.delete(feature);
        return this;
    }
    /** 设置测量类型 */
    setMeasureType(type) {
        this._measureType = type;
        this.fire('change:type', { type });
        if (this.actived) {
            this._feature = null;
            this.map.removeOverlay(this._measureTooltip);
            this._createMeasureTooltip();
            this.map.removeInteraction(this._draw);
            this.map.addInteraction(this._createDraw());
        }
        return this;
    }
    /** 工具激化处理事件 */
    onToolActived(e) {
        if (!super.onToolActived(e)) {
            return false;
        }
        this._createHelpTooltip();
        this._createMeasureTooltip();
        this._createDraw();
        this.map.getLayers().remove(this._vectorLayer);
        this.map.addLayer(this._vectorLayer);
        this.map.addInteraction(this._draw);
        this.map.on('pointermove', this._handlerMousemove);
        this.map.getViewport().addEventListener('mouseout', this._handlerMouseout);
        return true;
    }
    /** 工具失活处理事件 */
    onToolDeActived(e) {
        if (!super.onToolDeActived(e)) {
            return false;
        }
        this._feature = null;
        this.map.removeOverlay(this._helpTooltip);
        this.map.removeOverlay(this._measureTooltip);
        this.map.removeInteraction(this._draw);
        this.map.un('pointermove', this._handlerMousemove);
        this.map.getViewport().removeEventListener('mouseout', this._handlerMouseout);
        return true;
    }
}
//#region 私有静态属性
MeasureTool._MSG_START_TO_DRAW = 'Click to start drawing';
MeasureTool._MSG_CONTIUNE_POLYLINE = 'Click to continue drawing the polyline';
MeasureTool._MSG_CONTIUNE_POLYGON = 'Click to continue drawing the polygon';
export default MeasureTool;
