import Observer from '@xizher/observer'
import WebMap, { IMap, IView } from '../web-map/web-map'

/** WebMap插件类 */
class WebMapPlugin<T> extends Observer<T> {

  //#region 私有属性

  /** 插件对象名 */
  private _pluginName: string

  //#endregion

  //#region 保护属性

  /** 地图对象 */
  protected map_ : IMap

  /** 视图对象 */
  protected view_ : IView

  //#endregion

  //#region getter

  public get pluginName () : string {
    return this._pluginName
  }

  //#endregion

  //#region 构造函数

  /**
   * 构造WebMap插件对象
   * @param pluginName 插件对象名
   */
  constructor (pluginName: string) {
    super()
    this._pluginName = pluginName
  }

  //#endregion

  //#region 公有方法

  /**
   * 安装插件
   * @param webMap WebMap对象
   * @returns this
   */
  public installPlugin (webMap: WebMap) : this {
    this.map_ = webMap.map
    this.view_ = webMap.view
    return this
  }

  //#endregion

}

export default WebMapPlugin
