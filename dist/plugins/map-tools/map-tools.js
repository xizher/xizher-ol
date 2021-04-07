import WebMapPlugin from '../../web-map-plugin/web-map-plugin';
import BaseTool from './base-tool';
import DrawTool from './tools/draw/draw-tool';
import MarkRemoveTool from './tools/mark/mark-remove-tool';
import MarkTool from './tools/mark/mark-tool';
import MeasureRemoveTool from './tools/measure/measure-remove-tool';
import MeasureTool from './tools/measure/measure-tool';
import ZoomHomeTool from './tools/zoom/zoom-home-tool';
import ZoomInRectTool from './tools/zoom/zoom-in-rect-tool';
import ZoomInTool from './tools/zoom/zoom-in-tool';
import ZoomOutRectTool from './tools/zoom/zoom-out-rect-tool';
import ZoomOutTool from './tools/zoom/zoom-out-tool';
import FullscreenTool from './tools/fullscreen/fullsceen-tool';
import FullmapTool from './tools/zoom/fullmap-tool';
import ClearTool from './tools/clear/clear-tool';
import HitTestTool from './tools/hit-test/hit-test-tool';
/** 地图工具链 */
export class MapTools extends WebMapPlugin {
    //#endregion
    //#region 构造函数
    /** 构造地图工具链对象 */
    constructor() {
        super('mapTools');
        //#region 私有方法
        /** 工具池 */
        this._toolPool = new Map();
        /** 当前激活工具的Key */
        this._activedKey = 'default';
    }
    //#endregion
    //#region getter
    get activedKey() {
        return this._activedKey;
    }
    //#endregion
    //#region 私有方法
    /** 初始化 */
    _init() {
        this._toolPool
            .set('default', new BaseTool(this.map_, this.view_))
            .set('draw-point', new DrawTool(this.map_, this.view_, { drawType: 'point' }))
            .set('draw-line', new DrawTool(this.map_, this.view_, { drawType: 'line' }))
            .set('draw-line-faster', new DrawTool(this.map_, this.view_, { drawType: 'line-faster' }))
            .set('draw-polyline', new DrawTool(this.map_, this.view_, { drawType: 'polyline' }))
            .set('draw-polygon', new DrawTool(this.map_, this.view_, { drawType: 'polygon' }))
            .set('draw-rectangle', new DrawTool(this.map_, this.view_, { drawType: 'rectangle' }))
            .set('draw-rectangle-faster', new DrawTool(this.map_, this.view_, { drawType: 'rectangle-faster' }))
            .set('draw-circle', new DrawTool(this.map_, this.view_, { drawType: 'circle' }))
            .set('draw-circle-faster', new DrawTool(this.map_, this.view_, { drawType: 'circle-faster' }))
            .set('zoom-in', new ZoomInTool(this.map_, this.view_))
            .set('zoom-out', new ZoomOutTool(this.map_, this.view_))
            .set('zoom-in-rect', new ZoomInRectTool(this.map_, this.view_))
            .set('zoom-out-rect', new ZoomOutRectTool(this.map_, this.view_))
            .set('zoom-home', new ZoomHomeTool(this.map_, this.view_))
            .set('mark', new MarkTool(this.map_, this.view_))
            .set('mark-remove', new MarkRemoveTool(this.map_, this.view_, this.getTool('mark')))
            .set('measure', new MeasureTool(this.map_, this.view_))
            .set('measure-remove', new MeasureRemoveTool(this.map_, this.view_, this.getTool('measure')))
            .set('fullscreen', new FullscreenTool(this.map_, this.view_))
            .set('fullmap', new FullmapTool(this.map_, this.view_))
            .set('clear', new ClearTool(this.map_, this.view_))
            .set('hit-test', new HitTestTool(this.map_, this.view_));
    }
    //#endregion
    //#region 公有方法
    /** 重写：插件安装方法 */
    installPlugin(webMap) {
        super.installPlugin(webMap);
        this._init();
        return this;
    }
    /**
     * 设置工具
     * @param toolKey 工具Key
     */
    setMapTool(toolKey) {
        if (!this._toolPool.has(toolKey)) {
            return this;
        }
        const tool = this._toolPool.get(toolKey);
        if (tool.isOnceTool) {
            this.fire('change', {
                previousKey: this._activedKey,
                currentKey: this._activedKey,
                executeKey: toolKey,
                isOnceTool: true
            });
            tool.active();
            return this;
        }
        [...this._toolPool.values()].map(t => {
            if (t !== tool) {
                t.deactive();
            }
        });
        this.fire('change', {
            previousKey: this._activedKey,
            currentKey: toolKey,
            executeKey: toolKey,
            isOnceTool: false
        });
        this._activedKey = toolKey;
        tool.active();
        return this;
    }
    /**
     * 创建自定义工具
     * @param key 工具Key
     * @param tool 工具对象
     */
    createCustomTool(key, tool) {
        this._toolPool.set(key, tool);
        return this;
    }
    /**
     * 检查是否存在工具
     * @param key 工具Key
     */
    hasTool(key) {
        return this._toolPool.has(key);
    }
    /**
     * 移除工具
     * @param key 工具Key
     */
    deleteTool(key) {
        this._toolPool.has(key) && this._toolPool.delete(key);
        if (this._activedKey === key) {
            this.setMapTool('default');
        }
        return this;
    }
    /**
     * 获取工具
     * @param key 工具Key
     */
    getTool(key) {
        if (!this._toolPool.has(key)) {
            return null;
        }
        return this._toolPool.get(key);
    }
}
export default MapTools;
