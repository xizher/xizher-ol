import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { IGeometryStyleOptions, MapElementDisplay } from '../../../map-element-display/map-element-display';
/** 绘制器类 */
export declare class Drawer {
    /** 图元控制对象 */
    private _mapElementDisplay;
    /** 图形池 */
    private _graphicPool;
    /** 过程图形 */
    private _tempGraphic;
    /** 绘制结果图形样式 */
    private _drawedStyle;
    /** 绘制进行时样式 */
    private _drawingStyle;
    /** 构造绘制器对象 */
    constructor(mapElementDisplay: MapElementDisplay);
    /**
     * 匹配样式
     * @param geometries
     * @param styleOptions
     */
    private _matchStyle;
    /**
     * 设置绘制图形样式
     * @param style 样式
     */
    setDrawedStyle(style: IGeometryStyleOptions): this;
    /**
     * 设置绘制过程图形样式
     * @param style 样式
     */
    setDrawingStyle(style: IGeometryStyleOptions): this;
    /**
     * 添加图形
     * @param geometries 几何图形
     * @param styleOptions 样式配置项
     */
    add(geometries: Geometry | Geometry[], styleOptions?: IGeometryStyleOptions, returnFeature?: boolean): this | Feature[];
    /** 清空图形 */
    clear(): this;
    /**
     * 移除指定图形
     * @param features 图形
     */
    remove(features: Feature | Feature[]): this;
    /**
     * 设置图形
     * @param geometries 几何图形
     * @param styleOptions 样式配置项
     */
    set(geometries: Geometry | Geometry[], styleOptions?: IGeometryStyleOptions, returnFeature?: boolean): this | Feature[];
    /**
     * 设置过程图形
     * @param geometries 几何图形
     */
    setTemp(geometries: Geometry | Geometry[], returnFeature?: boolean): this | Feature[];
    /** 清理过程图形 */
    clearTemp(): this;
}
export default Drawer;
