# refetch
服务端数据获取，支持ajax和jsonp，使用promise A＋规范，支持cache。ajax使用了[qwest]https://github.com/pyrsmk/qwest

# Install
npm install refetch

# Api
```
refetch[method](url, data, options)
```

method: get, post, put, delete, jsonp

url: 必填

data: Object

options:
- dataType: type为ajax有效，可选值 post (default), json, text, arraybuffer, blob, document, formdata
- responseType: type为ajax有效，可选值 json (default), text, xml, arraybuffer, blob, document
- headers: Object
- timeout: 毫秒
- cache: 缓存，使用localStorage
- withCredentials: 是否支持跨域 default false
- async: 是否同步 default true
- delay: 延迟处理
