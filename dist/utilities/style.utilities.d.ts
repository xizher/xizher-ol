import CircleStyle, { Options as CircleStyleOptions } from 'ol/style/Circle';
import Fill, { Options as FillOptions } from 'ol/style/Fill';
import { Options as IconStyleOptions } from 'ol/style/Icon';
import { Options as RegularShapeStyleOptions } from 'ol/style/RegularShape';
import Stroke, { Options as StrokeOptions } from 'ol/style/Stroke';
import Style, { Options as StyleOptions, StyleFunction } from 'ol/style/Style';
/**
 * 创建圆样式
 * @param options 配置项
 */
export declare function createCircleStyle(options: CircleStyleOptions): CircleStyle;
/**
 * 创建样式
 * @param options 配置项
 */
export declare function createStyle(options: StyleOptions): Style;
/**
 * 创建Stroke
 * @param options 配置项
 */
export declare function createStroke(options: StrokeOptions): Stroke;
/**
 * 创建Fill
 * @param options 配置项
 */
export declare function createFill(options: FillOptions): Fill;
export interface ICircleStyleOptions {
    styleType?: 'circle';
    fill?: FillOptions;
    stroke?: StrokeOptions;
    radius?: number;
}
export interface IIconStyleOptions extends IconStyleOptions {
    styleType?: 'icon';
}
export interface IRegularShapeStyleOptions extends RegularShapeStyleOptions {
    styleType?: 'regular-shape';
}
export interface IStyleOptions {
    image?: ICircleStyleOptions | IIconStyleOptions | IRegularShapeStyleOptions;
    fill?: FillOptions;
    stroke?: StrokeOptions;
}
export declare function createStyle2(options: StyleFunction): StyleFunction;
export declare function createStyle2(options: IStyleOptions): Style;
export interface IUniqueStyleOptions {
    uniqueField: string;
    items?: {
        value: any;
        style: IStyleOptions;
    }[];
}
/** 创建唯一值样式渲染 */
export declare function createUniqueStyle(options: IUniqueStyleOptions): StyleFunction;
