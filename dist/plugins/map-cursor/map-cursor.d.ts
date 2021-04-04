import WebMapPlugin from '../../web-map-plugin/web-map-plugin';
/** 鼠标样式类型 */
export declare type MapCursorType = 'default' | 'pan' | 'panning' | 'wait' | 'draw' | 'zoomin' | 'zoomout' | 'clear';
/** 地图鼠标样式控制插件类 */
export declare class MapCursor extends WebMapPlugin<{
    'change': {
        type: MapCursorType;
    };
}> {
    /** 鼠标样式集 */
    private static readonly _MapCursorType;
    /** 鼠标样式 */
    private _cursorType;
    get cursorType(): MapCursorType;
    /** 构造地图鼠标样式控制对象 */
    constructor();
    /**
     * 设置地图鼠标样式
     * @param type 地图鼠标样式
     * @returns this
     */
    setCursor(type: MapCursorType): this;
}
export default MapCursor;
