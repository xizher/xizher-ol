import Observer from '@xizher/observer';
import OlMap from 'ol/Map';
import { MapOptions } from 'ol/PluggableMap';
import OlView, { ViewOptions } from 'ol/View';
import WebMapPlugin from '../web-map-plugin/web-map-plugin';
import Basemap from '../plugins/basemap/basemap';
import MapCursor from '../plugins/map-cursor/map-cursor';
import MapElementDisplay from '../plugins/map-element-display/map-element-display';
import MapTools from '../plugins/map-tools/map-tools';
import LayerOperation from '../plugins/layer-operation/layer-operation';
/** 地图对象接口 */
export interface IMap extends OlMap {
    $owner: WebMap;
}
/** 视图对象接口 */
export interface IView extends OlView {
    $owner: WebMap;
}
/** WebMap配置项接口 */
export interface IWebMapOptions {
    mapOptions?: MapOptions;
    viewOptions?: ViewOptions;
    debug?: boolean;
    debugName?: string;
}
/** WebMap类 */
export declare class WebMap extends Observer<{
    'loaded': void;
}> {
    basemap?: Basemap;
    mapCursor?: MapCursor;
    mapElementDisplay?: MapElementDisplay;
    mapTools?: MapTools;
    layerOperation?: LayerOperation;
    /** 地图目标容器Id */
    private _targetDiv;
    /** 地图对象 */
    private _map;
    /** 视图对象 */
    private _view;
    /** 配置项 */
    private _options;
    get targetDiv(): string;
    get map(): IMap;
    get view(): IView;
    /**
     * 构造WebMap对象
     * @param targetDiv 地图容器Id
     * @param options 配置项
     */
    constructor(targetDiv: string, options?: IWebMapOptions);
    /** 初始化 */
    private _init;
    /**
   * 挂载插件
   * @param plugin WebMap插件对象
   */
    use<T>(plugin: WebMapPlugin<T>): WebMap;
    /**
     * 挂载WebMap
     */
    mount(): WebMap;
}
export default WebMap;
