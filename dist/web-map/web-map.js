import Observer from '@xizher/observer';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import { baseUtils } from '@xizher/js-utils';
/** WebMap类 */
export class WebMap extends Observer {
    //#endregion
    //#region 构造函数
    /**
     * 构造WebMap对象
     * @param targetDiv 地图容器Id
     * @param options 配置项
     */
    constructor(targetDiv, options = {}) {
        super();
        /** 配置项 */
        this._options = {
            viewOptions: {
                center: [0, 0],
                zoom: 1,
                projection: 'EPSG:3857'
            },
            mapOptions: {
                controls: []
            }
        };
        this._targetDiv = targetDiv;
        baseUtils.$extend(true, this._options, options);
        this._init();
    }
    //#endregion
    //#region getter
    get targetDiv() {
        return this._targetDiv;
    }
    get map() {
        return this._map;
    }
    get view() {
        return this._view;
    }
    //#endregion
    //#region 私有方法
    /** 初始化 */
    _init() {
        const { mapOptions, viewOptions } = this._options;
        const view = new OlView(viewOptions);
        const map = new OlMap({ ...mapOptions, view });
        this._view = Object.assign(view, { $owner: this });
        this._map = Object.assign(map, { $owner: this });
        return this;
    }
    //#endregion
    //#region 公有方法
    /**
   * 挂载插件
   * @param plugin WebMap插件对象
   */
    use(plugin) {
        this[plugin.pluginName] = plugin.installPlugin(this);
        return this;
    }
    /**
     * 挂载WebMap
     */
    mount() {
        this._map.setTarget(this._targetDiv);
        this.fire('loaded');
        return this;
    }
}
export default WebMap;
