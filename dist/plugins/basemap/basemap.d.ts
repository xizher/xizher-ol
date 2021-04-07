import BaseLayer from 'ol/layer/Base';
import WebMapPlugin from '../../web-map-plugin/web-map-plugin';
import WebMap from '../../web-map/web-map';
/** 底图控制插件配置项 */
export interface IBasemapOptions {
    key?: string;
    visible?: boolean;
}
/** 底图控制插件类 */
export declare class Basemap extends WebMapPlugin<{
    'change': {
        key: string;
        visible: boolean;
    };
    'change:key': {
        key: string;
    };
    'change:visible': {
        visible: boolean;
    };
}> {
    /** 天地图墨卡托投影路径集合 */
    private static readonly _TianDiTu3857Urls;
    /** 天地图经纬度投影路径集合 */
    private static readonly _TianDiTu4326Urls;
    /** 捷泰地图路径集合 */
    private static readonly _GeoQUrls;
    /** 无Key值对应底图项异常提醒 */
    private static readonly _NoKeyOfBasemapItemException;
    /** 底图项容器池 */
    private _basemapItemPool;
    /** 当前选择的底图项 */
    private _key;
    /** 底图可见性 */
    private _visible;
    /** 底图存储图层组 */
    private _layerGroup;
    /** 配置项 */
    private _options;
    get key(): string;
    get visible(): boolean;
    get basemapItems(): string[];
    /**
     * 构造底图控制插件类
     * @param options 配置项
     */
    constructor(options?: IBasemapOptions);
    /** 初始化 */
    private _init;
    /**
     * 创建天地图底图项
     * @returns this
     */
    private _createTianDiTu;
    /**
     * 创建GeoQ底图项
     * @returns this
     */
    private _createGeoQDiTu;
    /**
     * 重写：安装插件
     * @param webMap WebMap对象
     * @returns this
     */
    installPlugin(webMap: WebMap): this;
    /**
     * 重新调整底图图层位置
     * @returns this
     */
    reSortLayers(): this;
    /**
     * 设置底图项
     * @param key 底图项Key值
     * @returns this
     */
    setBasemap(key: string): this;
    /**
     * 设置底图可见性
     * @param visible 可见性
     * @returns this
     */
    setVisible(visible: boolean): this;
    /**
     * 创建底图项
     * @param key 底图项Key值
     * @param layer 底图图层
     */
    createBasemapItem(key: string, layer: BaseLayer): this;
    /**
     * 创建底图项
     * @param key 底图项Key值
     * @param layers 底图图层数组
     */
    createBasemapItem(key: string, layers: BaseLayer[]): this;
    /**
     * 创建并设置底图项
     * @param key 底图项Key值
     * @param layer 底图图层
     */
    createBasemapItemAndSet(key: string, layer: BaseLayer): this;
    /**
     * 创建并设置底图项
     * @param key 底图项Key值
     * @param layers 底图图层数组
     */
    createBasemapItemAndSet(key: string, layers: BaseLayer[]): this;
}
export default Basemap;
