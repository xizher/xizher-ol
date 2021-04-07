import VectorSource from 'ol/source/Vector';
import { baseUtils } from '@xizher/js-utils';
import { createLayerGroup, createTileLayer, createVectorLayer } from '../../utilities/layer.utilities';
import WebMapPlugin from '../../web-map-plugin/web-map-plugin';
import GeoJSON from 'ol/format/GeoJSON';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import { extend } from 'ol/extent';
import VectorLayer from 'ol/layer/Vector';
import TileWMS from 'ol/source/TileWMS';
import TileLayer from 'ol/layer/Tile';
import createFetch from '@xizher/fetch-helper';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import { transformExtent } from 'ol/proj';
import { createStyle2, createUniqueStyle } from '../../utilities/style.utilities';
/** 插件：图层控制类 */
export class LayerOperation extends WebMapPlugin {
    //#endregion
    /** 构造图层控制对象 */
    constructor(options = {}) {
        super('layerOperation');
        //#region 私有属性
        /** 配置项 */
        this._options = {};
        /** 图层池 */
        this._layerPool = new Map();
        baseUtils.$extend(true, this._options, options);
    }
    //#endregion
    //#region 构造函数
    //#region getter
    get layerPool() {
        const pool = new Map();
        this._layerPool.forEach(([layer, options]) => {
            pool.set(options.name, {
                id: baseUtils.createGuid(),
                name: options.name,
                // target: layer,
                visible: layer.getVisible(),
                opacity: layer.getOpacity(),
                level: this._getLayerLevel(layer),
                type: options.type,
            });
        });
        return pool;
    }
    //#endregion
    //#region 私有方法
    /** 初始化 */
    _init() {
        this._layerGroup = createLayerGroup();
        this.map_.addLayer(this._layerGroup);
        this._options.layerItems?.forEach(layerItem => {
            this._initLayer(layerItem);
        });
    }
    /**
     * 创建图层
     * @param layerItemOptions 配置项
     */
    _initLayer(layerItemOptions) {
        const type = layerItemOptions.type;
        switch (type) {
            case 'wfs':
                this._initWfsLayer(layerItemOptions);
                break;
            case 'wms':
                this._initWmsLayer(layerItemOptions);
                break;
            default:
                break;
        }
    }
    /** 初始化WFS图层 */
    _initWfsLayer(layerItemOptions) {
        const layer = createVectorLayer({
            visible: true
        });
        layer.on('change:visible', () => this.fire('change:visible', {
            layer, visible: layer.getVisible(), layerName: layerItemOptions.name
        }));
        layer.on('change:opacity', () => this.fire('change:opacity', {
            layer, opacity: layer.getOpacity(), layerName: layerItemOptions.name
        }));
        layer.once('postrender', () => layer.setVisible(layerItemOptions.visible));
        const source = new VectorSource({
            format: new GeoJSON(),
            url: layerItemOptions.url,
            strategy: bboxStrategy
        });
        layer.setSource(source);
        if (layerItemOptions.style) {
            layerItemOptions.style.uniqueField
                ? layer.setStyle(createUniqueStyle(layerItemOptions.style))
                : layer.setStyle(createStyle2(layerItemOptions.style));
        }
        this._layerGroup.getLayers().push(layer);
        this._layerPool.set(layerItemOptions.name, [layer, layerItemOptions]);
    }
    /** 初始化WMS图层 */
    _initWmsLayer(layerItemOptions) {
        const source = new TileWMS({
            url: layerItemOptions.url,
            params: { ...layerItemOptions.params }
        });
        const layer = createTileLayer({ source, visible: layerItemOptions.visible });
        this._layerGroup.getLayers().push(layer);
        this._layerPool.set(layerItemOptions.name, [layer, layerItemOptions]);
        const [url] = layer.getSource().getUrls();
        createFetch() // getExtent is undefined, need to set
            .setUrl(url)
            .setParams({ 'REQUEST': 'GetCapabilities' })
            .setParams({ 'outputFormat': 'application/json' })
            .mountGet()
            .then(res => res.text())
            .then(res => {
            const wmsCapabilities = new WMSCapabilities().read(res);
            let extent = wmsCapabilities.Capability.Layer.Layer.find(item => item.Name === layerItemOptions.params['LAYERS'].split(':')[1])?.EX_GeographicBoundingBox; // TODO maybe wrong
            extent = transformExtent(extent, 'EPSG:4326', this.view_.getProjection());
            layer.setExtent(extent);
        });
    }
    /** 获取指定图层范围 */
    _getLayerExtent(layer) {
        if (layer instanceof VectorLayer) {
            return layer.getSource().getExtent();
        }
        if (layer instanceof TileLayer) {
            return layer.getExtent();
        }
    }
    /**
     * 获取图层层级
     * @param layer 图层对象
     */
    _getLayerLevel(layer) {
        const layerArr = this._layerGroup.getLayersArray();
        for (let i = 0; i < layerArr.length; i++) {
            if (layerArr[i] === layer) {
                return i;
            }
        }
        return -1;
    }
    /**
     * 获取图层名称
     * @param layer 图层对象
     */
    _getLayerName(layer) {
        const arr = [...this._layerPool.entries()];
        for (let i = 0; i < arr.length; i++) {
            if (layer === arr[i][1][0]) {
                return arr[i][0];
            }
        }
        return null;
    }
    //#endregion
    //#region 公有方法
    /** 安装插件 */
    installPlugin(webMap) {
        super.installPlugin(webMap);
        this._init();
        return this;
    }
    /** 获取所有图层的综合范围 */
    getFullExtent() {
        const layers = [...this._layerPool.values()];
        let extent = null;
        layers.forEach(([lyr]) => {
            const newExtent = this._getLayerExtent(lyr);
            if (extent) {
                extent = extend(extent, newExtent);
            }
            else {
                extent = newExtent;
            }
        });
        return extent;
    }
    /** 通过图层名获取图层对象 */
    getLayerByName(name) {
        if (!this._layerPool.has(name)) {
            return null;
        }
        const [layer] = this._layerPool.get(name);
        return layer;
    }
    /**
     * 设置图层可见性
     * @param arg0 图层名 或 图层对象
     * @param visible 图层可见性，默认true
     */
    setLayerVisible(arg0, visible = true) {
        const layer = typeof arg0 === 'string'
            ? this.getLayerByName(arg0)
            : arg0;
        if (!layer) {
            return;
        }
        layer.setVisible(visible);
        return this;
    }
    /**
     * 设置图层透明度
     * @param arg0 图层名 或 图层对象
     * @param opacity 不可透明度
     */
    setLayerOpacity(arg0, opacity) {
        const layer = typeof arg0 === 'string'
            ? this.getLayerByName(arg0)
            : arg0;
        if (!layer) {
            return;
        }
        layer.setOpacity(opacity);
        return this;
    }
    /**
     * 设置图层层级
     * @param arg0 图层名 或 图层对象
     * @param level 图层层级
     */
    setLayerLevel(arg0, level) {
        const layer = typeof arg0 === 'string'
            ? this.getLayerByName(arg0)
            : arg0;
        if (!layer) {
            return;
        }
        this._layerGroup.getLayers().remove(layer);
        this._layerGroup.getLayers().insertAt(level, layer);
        this.fire('change:level', {
            layerName: typeof arg0 === 'string' ? arg0 : this._getLayerName(layer), layer, level
        });
        return this;
    }
    /**
     * 缩放至图层
     * @param arg0 图层名 或 图层对象
     */
    zoomToLayer(arg0) {
        const layer = typeof arg0 === 'string'
            ? this.getLayerByName(arg0)
            : arg0;
        if (!layer) {
            return;
        }
        const extent = this._getLayerExtent(layer);
        if (extent) {
            this.view_.fit(extent, { duration: 500 });
        }
        return this;
    }
    /**
     * 获取图层属性
     * @param arg0 图层名 或 图层对象
     */
    getAttributes(arg0) {
        const name = typeof arg0 === 'string'
            ? arg0
            : this._getLayerName(arg0);
        const [layer, options] = this._layerPool.get(name);
        if (!layer) {
            return null;
        }
        if (options.type !== 'wfs') {
            return null;
        }
        return layer.getSource().getFeatures().map((feat, index) => {
            const props = feat.getProperties();
            delete props.geometry;
            props.$index = index;
            props.$id = feat.getId();
            return props;
        });
    }
}
export default LayerOperation;
