import Layer from 'ol/layer/Layer';
import WebMap from '../../web-map/web-map';
import WebMapPlugin from '../../web-map-plugin/web-map-plugin';
import { Extent } from 'ol/extent';
import { IStyleOptions, IUniqueStyleOptions } from '../../utilities/style.utilities';
export declare type OgcServerString = 'wfs' | 'wms';
export interface IWMSCapabilitiesResult {
    Capability: {
        Layer: {
            Layer: {
                Name: string;
                EX_GeographicBoundingBox: Extent;
            }[];
        };
    };
    Service: {};
    version: string;
}
export interface ILayerItemOptions {
    name?: string;
    type?: OgcServerString;
    url?: string;
    params?: Object;
    visible?: boolean;
    style?: IStyleOptions | IUniqueStyleOptions;
}
export interface ILayerOperationOptions {
    layerItems?: ILayerItemOptions[];
}
export interface ILayerItem {
    id: string;
    name: string;
    visible: boolean;
    opacity: number;
    level: number;
    type: OgcServerString;
}
/** 插件：图层控制类 */
export declare class LayerOperation extends WebMapPlugin<{
    'change:visible': {
        layerName: string;
        layer: Layer;
        visible: boolean;
    };
    'change:opacity': {
        layerName: string;
        layer: Layer;
        opacity: number;
    };
    'change:level': {
        layerName: string;
        layer: Layer;
        level: number;
    };
}> {
    /** 配置项 */
    private _options;
    /** 图层池 */
    private _layerPool;
    /** 图层组 */
    private _layerGroup;
    get layerPool(): Map<string, ILayerItem>;
    /** 构造图层控制对象 */
    constructor(options?: ILayerOperationOptions);
    /** 初始化 */
    private _init;
    /**
     * 创建图层
     * @param layerItemOptions 配置项
     */
    private _initLayer;
    /** 初始化WFS图层 */
    private _initWfsLayer;
    /** 初始化WMS图层 */
    private _initWmsLayer;
    /** 获取指定图层范围 */
    private _getLayerExtent;
    /**
     * 获取图层层级
     * @param layer 图层对象
     */
    private _getLayerLevel;
    /**
     * 获取图层名称
     * @param layer 图层对象
     */
    private _getLayerName;
    /** 安装插件 */
    installPlugin(webMap: WebMap): this;
    /** 获取所有图层的综合范围 */
    getFullExtent(): Extent | null;
    /** 通过图层名获取图层对象 */
    getLayerByName(name: string): Layer | null;
    /**
     * 设置图层可见性
     * @param arg0 图层名 或 图层对象
     * @param visible 图层可见性，默认true
     */
    setLayerVisible(arg0: string | Layer, visible?: boolean): this;
    /**
     * 设置图层透明度
     * @param arg0 图层名 或 图层对象
     * @param opacity 不可透明度
     */
    setLayerOpacity(arg0: string | Layer, opacity: number): this;
    /**
     * 设置图层层级
     * @param arg0 图层名 或 图层对象
     * @param level 图层层级
     */
    setLayerLevel(arg0: string | Layer, level: number): this;
    /**
     * 缩放至图层
     * @param arg0 图层名 或 图层对象
     */
    zoomToLayer(arg0: string | Layer): this;
    /**
     * 获取图层属性
     * @param arg0 图层名 或 图层对象
     */
    getAttributes<T extends {
        [key: string]: any;
    }>(arg0: string | Layer): T[] | null;
}
export default LayerOperation;
