# @xizher/ol

## 安装

```bash
npm install @xizher/ol
```

## 使用

```javascript
import {
  WebMap,
  MapCursor,
  Basemap,
} from '@xizher/ol'

const webMap = new WebMap('ol-container')
  .use(new Basemap())
  .use(new MapCursor())
	.mount()
```



