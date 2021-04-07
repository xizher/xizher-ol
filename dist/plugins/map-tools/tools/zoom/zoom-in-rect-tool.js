import DrawTool from '../draw/draw-tool';
/** 拉框放大工具类 */
export class ZoomInRectTool extends DrawTool {
    //#region 构造函数
    /**
     * 构造拉框放大工具对象
     * @param map 地图对象
     * @param view 视图对象
     */
    constructor(map, view) {
        super(map, view, {
            drawType: 'rectangle-faster',
            cursorType: 'zoomin'
        });
        this.drawer.setDrawingStyle({
            polygonStyle: {
                fill: { color: 'rgba(0, 0, 0, 0.5)' },
                stroke: { color: 'rgba(0, 0, 0, 0.8)' },
            }
        });
    }
    //#endregion
    //#region 公有方法
    /** 重写：绘图过程处理事件 */
    onDrawEnd(e) {
        const result = super.onDrawEnd(e);
        if (result) {
            this.clearDrawed();
            const [feature] = result;
            this.view.fit(feature.getGeometry().getExtent(), { duration: 500 });
        }
        return result;
    }
}
export default ZoomInRectTool;
