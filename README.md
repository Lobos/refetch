# refetch
服务端数据获取，支持ajax和jsonp，使用promise A＋规范，支持cache。ajax使用了[qwest](https://github.com/pyrsmk/qwest)

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
- dataType: method 为jsonp时无效。可选值 post (default), json, text, arraybuffer, blob, document, formdata
- responseType: method 为jsonp时无效。可选值 json (default), text, xml, arraybuffer, blob, document
- headers: method 为jsonp时无效。object
- timeout: 毫秒
- cache: 缓存，单位秒，大于0时有效。使用localStorage做长期缓存，需要注意缓存数据大小。
- withCredentials: method 为jsonp时无效。是否支持跨域 default false
- async: method 为jsonp时无效。是否同步 default true
- delay: 延时处理，单位毫秒，默认为0。

# Example
```
refetch.get('hello.html')
    .then(function () {response} {
        console.log(response);
    });

refetch.post('hello.html', { name: 'world' })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (response) {
        console.log(response);
    });
```
