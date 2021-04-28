import Observer, { IObserverCallbackParams } from '@xizher/observer'
import WebMap from '../web-map/web-map'

export type OnResetParams<T> = IObserverCallbackParams<'reset', T>
export type OnDoneParams<T> = IObserverCallbackParams<'done', T>
export type OnExecutingParams<T> = IObserverCallbackParams<'executing', T>

export interface IToolBaseEvent<T> {
  'reset': void
  'done': {
    success: true
    result: T
  } | {
    success: false
    error: unknown
  }
  'executing': void
}

/** 基础工具类 */
export class ToolBase<T extends IToolBaseEvent<unknown>> extends Observer<T & IToolBaseEvent<unknown>> {

  //#region 保护属性

  /** WebMap对象 */
  protected webMap_: WebMap

  //#endregion

  //#region 构造函数

  /**
   * 初始化基础工具类
   * @param webMap WebMap对象
   */
  constructor (webMap: WebMap) {
    super()
    this.webMap_ = webMap

    this.on('reset', e => this.onReset_(e))
    this.on('done', e => this.onDone_(e))
    this.on('executing', e => this.onExecuting_(e))
  }

  //#endregion

  //#region 保护方法

  /** 工具重置触发事件 */
  protected onReset_ (e: OnResetParams<this>) : void { // eslint-disable-line
    // ...
  }

  /** 工具执行完成触发事件 */
  protected onDone_ (e: OnDoneParams<this>) : void { // eslint-disable-line
    document.body.style.cursor = 'default'
  }

  /** 工具执行过程触发事件 */
  protected onExecuting_ (e: OnExecutingParams<this>) : void { // eslint-disable-line
    document.body.style.cursor = 'wait'
    // ...
  }

  //#endregion

  //#region 公有方法

  public reset () : void {
    this.fire('reset')
  }

  public execute () : void {
    this.fire('executing')
  }

  //#endregion

}

export default ToolBase
