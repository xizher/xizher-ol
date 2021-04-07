import WebMap from '../../web-map/web-map';
import WebMapPlugin from '../../web-map-plugin/web-map-plugin';
import BaseTool from './base-tool';
/** 地图工具链 */
export declare class MapTools extends WebMapPlugin<{
    'change': {
        previousKey: string;
        executeKey: string;
        currentKey: string;
        isOnceTool: boolean;
    };
}> {
    /** 工具池 */
    private _toolPool;
    /** 当前激活工具的Key */
    private _activedKey;
    get activedKey(): string;
    /** 构造地图工具链对象 */
    constructor();
    /** 初始化 */
    private _init;
    /** 重写：插件安装方法 */
    installPlugin(webMap: WebMap): this;
    /**
     * 设置工具
     * @param toolKey 工具Key
     */
    setMapTool(toolKey: string): this;
    /**
     * 创建自定义工具
     * @param key 工具Key
     * @param tool 工具对象
     */
    createCustomTool(key: string, tool: BaseTool<unknown>): this;
    /**
     * 检查是否存在工具
     * @param key 工具Key
     */
    hasTool(key: string): boolean;
    /**
     * 移除工具
     * @param key 工具Key
     */
    deleteTool(key: string): this;
    /**
     * 获取工具
     * @param key 工具Key
     */
    getTool<T extends BaseTool<unknown>>(key: string): T | null;
}
export default MapTools;
