import { Coordinate } from 'ol/coordinate';
import { Extent } from 'ol/extent';
import Circle from 'ol/geom/Circle';
import GeometryLayout from 'ol/geom/GeometryLayout';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
/**
 * 创建点对象
 * @param coordinate 坐标
 * @param optLayout 配置项
 */
export declare function createPoint(coordinate: Coordinate, optLayout?: GeometryLayout): Point;
/**
 * 创建线对象
 * @param coordinates 坐标集合
 * @param optLayout 配置项
 */
export declare function createLineString(coordinates: Coordinate[], optLayout?: GeometryLayout): LineString;
/**
 * 创建面对象
 * @param coordinates 坐标集合
 * @param optLayout 配置项
 * @param optEnds 配置项
 */
export declare function createPolygon(coordinates: Coordinate[][], optLayout?: GeometryLayout, optEnds?: number[]): Polygon;
/**
 * 创建圆对象
 * @param center 圆心坐标
 * @param radius 圆半径
 * @param optLayout 配置项
 */
export declare function createCircle(center: Coordinate, radius: number, optLayout?: GeometryLayout): Circle;
/**
 * 创建范围对象
 * @param bounds 范围坐标集合
 */
export declare function createExtent(bounds: [number, number, number, number]): Extent;
