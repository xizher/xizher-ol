import { baseUtils } from '@xizher/js-utils';
/** 绘制器类 */
export class Drawer {
    //#endregion
    //#region 构造函数
    /** 构造绘制器对象 */
    constructor(mapElementDisplay) {
        /** 图形池 */
        this._graphicPool = new Set();
        /** 过程图形 */
        this._tempGraphic = null;
        /** 绘制结果图形样式 */
        this._drawedStyle = {
            pointStyle: {
                image: {
                    styleType: 'circle',
                    radius: 5,
                    stroke: {
                        color: 'red',
                        width: 1
                    },
                    fill: {
                        color: 'rgba(255, 0, 0, 0.8)'
                    }
                }
            },
            polylineStyle: {
                stroke: {
                    color: 'red',
                    width: 1
                }
            },
            polygonStyle: {
                stroke: {
                    color: 'red',
                    width: 1
                },
                fill: {
                    color: 'rgba(255, 0, 0, 0.5)'
                }
            }
        };
        /** 绘制进行时样式 */
        this._drawingStyle = {
            pointStyle: {
                image: {
                    styleType: 'circle',
                    radius: 5,
                    stroke: {
                        color: 'rgba(255, 0, 0, 0.5)',
                        width: 1
                    },
                    fill: {
                        color: 'rgba(255, 0, 0, 0.4)'
                    }
                }
            },
            polylineStyle: {
                stroke: {
                    color: 'rgba(255, 0, 0, 0.5)',
                    width: 1
                }
            },
            polygonStyle: {
                stroke: {
                    color: 'rgba(255, 0, 0, 0.5)',
                    width: 1
                },
                fill: {
                    color: 'rgba(255, 0, 0, 0.25)'
                }
            }
        };
        this._mapElementDisplay = mapElementDisplay;
    }
    //#endregion
    //#region 私有方法
    /**
     * 匹配样式
     * @param geometries
     * @param styleOptions
     */
    _matchStyle(geometries, styleOptions) {
        const type = Array.isArray(geometries)
            ? geometries[0].getType()
            : geometries.getType();
        let style = {};
        switch (type) {
            case 'Point':
                style = baseUtils.deepCopy(styleOptions.pointStyle);
                break;
            case 'LineString':
                style = baseUtils.deepCopy(styleOptions.polylineStyle);
                break;
            case 'Polygon':
            case 'Circle':
                style = baseUtils.deepCopy(styleOptions.polygonStyle);
                break;
            default:
                break;
        }
        return style;
    }
    //#endregion
    //#region 公有方法
    /**
     * 设置绘制图形样式
     * @param style 样式
     */
    setDrawedStyle(style) {
        baseUtils.$extend(true, this._drawedStyle, style);
        return this;
    }
    /**
     * 设置绘制过程图形样式
     * @param style 样式
     */
    setDrawingStyle(style) {
        baseUtils.$extend(true, this._drawingStyle, style);
        return this;
    }
    /**
     * 添加图形
     * @param geometries 几何图形
     * @param styleOptions 样式配置项
     */
    add(geometries, styleOptions = {}, returnFeature = false) {
        this.clearTemp();
        const _styleOptions = baseUtils.deepCopy(this._drawedStyle);
        baseUtils.$extend(true, _styleOptions, styleOptions);
        const features = this._mapElementDisplay.parseGraphics(geometries, this._matchStyle(geometries, this._drawedStyle));
        this._mapElementDisplay.add(features);
        features.forEach(f => this._graphicPool.add(f));
        if (returnFeature) {
            return features;
        }
        return this;
    }
    /** 清空图形 */
    clear() {
        this
            .remove([...this._graphicPool.values()])
            .clearTemp();
        return this;
    }
    /**
     * 移除指定图形
     * @param features 图形
     */
    remove(features) {
        const _features = Array.isArray(features) ? features : [features];
        if (_features.length === 0) {
            return this;
        }
        this._mapElementDisplay.remove(_features);
        _features.forEach(feat => this._graphicPool.delete(feat));
        return this;
    }
    /**
     * 设置图形
     * @param geometries 几何图形
     * @param styleOptions 样式配置项
     */
    set(geometries, styleOptions = {}, returnFeature = false) {
        return this
            .clear()
            .add(geometries, styleOptions, returnFeature);
    }
    /**
     * 设置过程图形
     * @param geometries 几何图形
     */
    setTemp(geometries, returnFeature = false) {
        this.clearTemp();
        const feature = this._mapElementDisplay.parseGraphics(geometries, this._matchStyle(geometries, this._drawingStyle));
        this._mapElementDisplay.add(feature);
        this._tempGraphic = feature;
        if (returnFeature) {
            return feature;
        }
        return this;
    }
    /** 清理过程图形 */
    clearTemp() {
        if (this._tempGraphic) {
            this._mapElementDisplay.remove(this._tempGraphic);
            this._tempGraphic = null;
        }
        return this;
    }
}
export default Drawer;
