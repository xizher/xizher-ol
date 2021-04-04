import { Options as IXYZOptions } from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
import { Options as IOSMOptions } from 'ol/source/OSM';
import LayerGroup, { Options as ILayerGroup } from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import { Options as IBaseTileOptions } from 'ol/layer/BaseTile';
import { Options as IBaseVectorOptions } from 'ol/layer/BaseVector';
/**
 * 创建XYZ图层
 * @param xyzUrl XYZ地址
 * @param options 配置项
 * @returns XYZ图层
 */
export declare function createXYZLayer(xyzUrl: string, options?: {
    xyzOptions?: IXYZOptions;
    layerOptions?: IBaseTileOptions;
}): TileLayer;
/**
 * 创建OSM图层
 * @param options 配置项
 * @returns OSM图层
 */
export declare function createOSMLayer(options?: {
    osmOptions?: IOSMOptions;
    layerOptions?: IBaseTileOptions;
}): TileLayer;
/**
 * 创建图层组
 * @param options 配置项
 * @returns 图层组
 */
export declare function createLayerGroup(options?: ILayerGroup): LayerGroup;
/**
 * 创建矢量图层
 * @param options 配置项
 * @returns 矢量图层
 */
export declare function createVectorLayer(options?: IBaseVectorOptions): VectorLayer;
/**
 * 创建Tile图层
 * @param options 配置项
 * @returns Tile图层
 */
export declare function createTileLayer(options?: IBaseTileOptions): TileLayer;
