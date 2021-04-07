import Circle from 'ol/geom/Circle';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
/**
 * 创建点对象
 * @param coordinate 坐标
 * @param optLayout 配置项
 */
export function createPoint(coordinate, optLayout) {
    return new Point(coordinate, optLayout);
}
/**
 * 创建线对象
 * @param coordinates 坐标集合
 * @param optLayout 配置项
 */
export function createLineString(coordinates, optLayout) {
    return new LineString(coordinates, optLayout);
}
/**
 * 创建面对象
 * @param coordinates 坐标集合
 * @param optLayout 配置项
 * @param optEnds 配置项
 */
export function createPolygon(coordinates, optLayout, optEnds) {
    return new Polygon(coordinates, optLayout, optEnds);
}
/**
 * 创建圆对象
 * @param center 圆心坐标
 * @param radius 圆半径
 * @param optLayout 配置项
 */
export function createCircle(center, radius, optLayout) {
    return new Circle(center, radius, optLayout);
}
/**
 * 创建范围对象
 * @param bounds 范围坐标集合
 */
export function createExtent(bounds) {
    const [xmin, ymin, xmax, ymax] = bounds;
    const polygon = createPolygon([[
            [xmin, ymin], [xmin, ymax], [xmax, ymax], [xmax, ymin]
        ]]);
    return polygon.getExtent();
}
