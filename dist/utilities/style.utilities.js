import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import IconStyle from 'ol/style/Icon';
import RegularShapeStyle from 'ol/style/RegularShape';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
/**
 * 创建圆样式
 * @param options 配置项
 */
export function createCircleStyle(options) {
    return new CircleStyle(options);
}
/**
 * 创建样式
 * @param options 配置项
 */
export function createStyle(options) {
    return new Style(options);
}
/**
 * 创建Stroke
 * @param options 配置项
 */
export function createStroke(options) {
    return new Stroke(options);
}
/**
 * 创建Fill
 * @param options 配置项
 */
export function createFill(options) {
    return new Fill(options);
}
/**
 * 创建样式
 * @param options 配置项
 */
export function createStyle2(options) {
    if (typeof options === 'function') {
        return options;
    }
    let image, fill, stroke;
    if (options.image) {
        switch (options.image.styleType) {
            case 'circle':
                image = createCircleStyle({
                    fill: createFill(options.image.fill),
                    stroke: createStroke(options.image.stroke),
                    radius: options.image.radius
                });
                break;
            case 'icon':
                image = new IconStyle(options.image);
                break;
            case 'regular-shape':
                image = new RegularShapeStyle(options.image);
                break;
            default:
                break;
        }
    }
    if (options.fill) {
        fill = createFill(options.fill);
    }
    if (options.stroke) {
        stroke = createStroke(options.stroke);
    }
    return new Style({ image, fill, stroke });
}
/** 创建唯一值样式渲染 */
export function createUniqueStyle(options) {
    return (feature) => {
        const value = feature.getProperties()[options.uniqueField];
        const styleOptions = options.items.find(item => item.value === value)?.style;
        if (styleOptions) {
            return createStyle2(styleOptions);
        }
        return null;
    };
}
