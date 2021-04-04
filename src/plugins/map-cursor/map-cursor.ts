import WebMapPlugin from '../../web-map-plugin/web-map-plugin'

/** 鼠标样式类型 */
export type MapCursorType =
'default' |
'pan' |
'panning' |
'wait' |
'draw' |
'zoomin' |
'zoomout' |
'clear'

/** 地图鼠标样式控制插件类 */
export class MapCursor extends WebMapPlugin<{
  'change': { type: MapCursorType }
}> {

  //#region 静态私有属性

  /** 鼠标样式集 */
  private static readonly _MapCursorType = {
    default: 'default',
    pan: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABJElEQVQ4T5XTvytGcRTH8dfzJ7AZlDIo2ex+TQaDhaQkGRFhsmAXSRksTJJBMinEYlGUhcHAZjAarDr6Xt3nPi6PU99u3e857/s5n3NuRXksYAmvmMbVT6mVwssGzKIbPRhGO0bxgDNs52uKgCGsYwxzGMzBHrGGTrxlkCJgJV3EcxmrSUnkXaazhYDFUS8gcsODI9wn6CJu/wvYxQS+leYBYVaYFlFsIVMQ/swXAQOIvlpwjutfAJkvVQoOcIfDNKKb3BfKtqQK8JxGFyqaMflfQNDG0YsXjCBU/RY1JkbBR3L4j9qv62PsR9vZFJpwig3s1UGI/6MLT/kx9uEEHamVMk4rLtLUajZxCv3YwXsJoS35FJ7VALIlmkFjCSBWejP54BNJm0cR2+ErQgAAAABJRU5ErkJggg==), default',
    panning: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABFUlEQVQ4T6XSvytGYRjG8c+7mFjEYjIaKAMLC4syWSxSfmR7M1gkFgyU3sFkYkBJoZR/wI+Sv0AZLUalZDHprufUeU+djjpnec7Tuc/3vu7rvhpqPo2a/ysDTOABO+hM7yN4xXW+aREwjBN8IyBZcS8esZ1gpzgLUB7QhRUMpfMcC6nbPrYSoB89eEIrAzSxjl98YiwV7yZAnNF9FjdJXdwnM8AtLnGFNwxUmBvjtQHuEV3CuANs1AGM47kCMIO1/AiH+Eoq/hONFn5izZkH07jDXtp9FeQFmzFyfo1TuMBRBaQPH1kEikEaTZCQeFwiYwmLMX8xSFn9fJK3WgKYQweWywDdyczBEkBEOqL8XgaoMrDt+x9D2DURq20LzwAAAABJRU5ErkJggg==), default',
    wait: 'wait',
    draw: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADnSURBVDhPpdG/asJQFIDxYFeV4mOIQ6GjWNDB3UEfwaGbYyedCg76BiIKfYEOYqeOgpsggpODCHasiNJJv6PnhpuQ+Cf94OdJAvfmBh1Ky0/UHrDFO2pI4gcb3FULC/zhgCmayOGmSpCFspHZxPjFB14Q2iN2MG+3NzC+cLFP2AsG6PqeZeApplP61imNMIacqiMPtDedbmEbzJHCKybyQCvodJO/0bRGFQk8YQj5jDZMcZ157LE63Vn1YH+zX12Ze88JpKXOZ512Dd+sYHa+DK6IPoLeXMZd/WuxHDnyYimLyIuv5DhHTNdI4vF9bjkAAAAASUVORK5CYII=), default',
    zoomin: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABa0lEQVQ4T5XSv0vWURTH8dczNbhIpogRtERDIEoI2Q/CqbWliJZqEkTyZ4NTtUc6ND20SpCghJMuikPgkE4KimODgSj0DyTn4V64XZ7Azva9937f53PO59Pwd13HGPoxjGPs4ADvqretz0Zx+BKf0IEf+I4A3kYftnGnhmTAA2ylyxFsVg+n8BFHuFHeBeBKkni5UlQ3e4KvCNhCvgzAB8zgKZaKv/7gfTX7Ip6jF7/yDjZwCXerlu0Aj7GCR1jPgN/4jOkEiB/ryko6cYY3SXnLhVhMWBUjRGW73qYRMizOB7CbxviSFSxjCNcuMMIk5nEThxkQnYLexGgByUrKAP3EVdzCfhmkkPOsXE6bPQQomkXtpZH3yySGLT1JSQRpLYXmPl6lruF/JDTy0IKUgCDHg4k23eNoHKcItTlUzRoQD7tTt0GcpJSGU6/TCDlwrZHaAf4hQBe+4V6y92E48T+AAId9LzCHVcyeA/3HS5LDGButAAAAAElFTkSuQmCC), default',
    zoomout: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYklEQVQ4T5XSv0tVcRjH8dedHFxETSIJWsJBiESEUkOaXFsUcakmQcSfNTipe6SD08VVBIUimmwxHAQHdfKC0uigEAX9A8lz+R44Ho5c/W7n+3zP+3k+z+dTcfM8wSSe4SUucYwzLBfe1j8ruct3WEczjnCAAPbiEQ7xogjJAK+wn4qv8bPwcA6f8QtP87UAtKcRWwsTFZuNYBsBW8uKAfiEBYxip0xn7m4T43iIq2wHe2hCf4Ofo/wGXzGMHxngHzYwnwD/S0AryYUW/MXHNHndhVhMWBUS4pTale6f4yTJ2Mom+II+PL6DhFmsogvnGWAp0auYaAC5QCe6UcsHKcYZyy+nBBTSolmc0yS5lk9i2NKBmCSCtJtCM4j3qWv4HwmNPNQheUCQ48HMLTKm8AcxbRaqahEQ/z5I3XrwO6U0nJpOErLA1SWVAW7bYxu+YQCRi6Fw4j6AAId9b7GI7/hwDSbJQ5LqoLCkAAAAAElFTkSuQmCC), default',
    clear: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABBElEQVQ4T9XTvyvFURjH8df9AwwGo9xMYjDwB7gDg4WVIjbJzWzCZpTFYCALm1KUpOwoNhYGk00xGAw6Ot/b6Xbu91s2p07nR5/zfs7znM+pqW7TuMJHTlqrON/EDg6w+BfABtZxjcb/AXRhJF53LElhM+7d471IJ1fEBeyXFPcOo2WAonBlD9QKnLtBD4YwGMcw/8ZDW/8NkANsY7XCHwN46gQ4w2QFYAqnnQAvqCeAL7yhL9nbwloOMIELPEdxPx5xgzm8ohfHmMkBDqMwpHEbPXCOE+zhEuM4wmw7YAm7MXLwQjBT+Ezz6MZyBKwgmO2zAAxHQVq38HmCC0NL58W6pf0BEUUzEdQNGPUAAAAASUVORK5CYII=), default',
  }

  //#endregion

  //#region 私有属性

  /** 鼠标样式 */
  private _cursorType : MapCursorType = 'default'

  //#endregion

  //#region getter

  public get cursorType () : MapCursorType {
    return this._cursorType
  }

  //#endregion

  //#region 构造函数

  /** 构造地图鼠标样式控制对象 */
  constructor () {
    super ('mapCursor')
  }

  //#endregion

  //#region 公有方法

  /**
   * 设置地图鼠标样式
   * @param type 地图鼠标样式
   * @returns this
   */
  public setCursor (type: MapCursorType) : this {
    this.map_.getTargetElement().style.cursor = MapCursor._MapCursorType[type]
    this._cursorType = type
    this.fire('change', { type })
    return this
  }

  //#endregion

}

export default MapCursor
