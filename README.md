## 前言

+ 从 `<from>` 提交，到 `ajax` ，前后端的交互变得更加灵活且舒适，再到 JQ 的 `$ajax` 、`axios`，我们好像写起来越来越方便了
+ 但是，我越来越忘记了 `ajax` 原本到底是个什么东西，他原本长得什么样子？我有印象，但似乎，又不太知道他是个啥，除了 `ajax` ，`fetch` 又是什么？
+ 这次，就让我好好复习，重温前后端的交互吧
+ 想直接看 Demo 的话在这~ [Demo](https://github.com/milk0v0/xhrDemo)



## ajax

###  是什么

+ ajax 即"**A**synchronous **J**avascript **A**nd **X**ML"（异步 JavaScript 和 XML）
+ 他并不是一种新的语言，而是一种使用现有技术标准的新方法
+ 它可以再不重新加载整个页面的情况下，与服务器交换数据并能够更新部分网页的技术
+ 通过在后台与服务器进行少量数据交换，`ajax` 可以使网页实现异步更新



### 基本使用

+ ajax 基于 XMLHttpRequest 对象
+ 创建 XMLHttpRequest 对象

```javascript
let xhr = new XMLHttpRequest();
```

+ 配置请求参数
+ 同步会造成代码阻塞，将在数据交互完成后（成功、超时、失败等）才可进行下一步操作，用户会感觉卡顿，用户体验不好，一般使用异步（可以调一下浏览器网速看看效果）

```javascript
xhr.open('get', '/checkUserName', true); // true 为异步 false 为同步
```

+ 接收返还值
+ 返回值将于 `xhr.responseText` 呈现

```javascript
xhr.onload = function () {
    console.log(this.responseText)
}
```

+ 发送至服务器

```javascript
xhr.send();
```



### xhr.open(method, url, async)

+ 规定向服务器发送请求的配置
  1. method - 请求的类型；get 或 post
  2. url - 文件在服务器的位置 - 请求数据地址
  3. async - 是否采用异步处理 - true: 同步; false: 异步

+ `get` 和 `post` 注意点
  + 与 POST 相比，GET 更简单也更快，并且在大部分情况下都能用
  + 然而，在以下情况中，请使用 POST 请求：
    + 无法使用缓存文件（更新服务器上的文件或数据库）
    + 向服务器发送大量数据（POST 没有数据量限制）
    + 发送包含未知字符的用户输入时，POST 比 GET 更稳定也更可靠



### 发送数据

#### URL 传参

1. `queryString`
	+ 一般形式为 `?key=val`
	+ 如果有多个参数则通过 `&` 进行拼接，如：`?key1=val1&key2=val2`
2. `params`
	+ `node - KoaRouter` 后端表现形式为 `/get/:key` ，以 `:` 表示
	+ 前端则是在 URL 后加上 `/val` 传
	+ 如多个参数，后端: `/get/:key1/:key2`；前端: `/val1/val2`
+ `queryString` 和 `params` 注意点
  + 选择使用 `queryString` 还是 `params` 其实都可以，视路由设计思路选择
  + 值得注意的是 和 `function` 的传参一样
    + 如果是 `params` 的话即使前面的传参不需要，也需要占位，例如：`/val1/val2`，`val1` 不需要的情况下也要写上占位
    + 而 `queryString` 则不需要，想要传哪一个参数，直接写对应的 `key=val` 就可以了
  +  `params` 规定动态路由后，如不带参数，请求失败，例如：
    + 后端：`get/:key`
    + 前端必须请求：`/get/val`，如直接请求 `/get` 则会请求失败
  + URL 的传参与请求方式 `get` 和 `post` 无关，两种请求方式都可以 URL 携带参数




#### xhr.send()

+ 在发送请求到服务器时，可携带参数

+ 此方法仅用于 `post`

+ 发送数据时需要设置http正文头格式

  + 请求头类型与 `<from>` 表单的 `enctype` 基本一样

  1. `text/plain` - 不写正文头格式 - 以 `string` 进行发送
  2. `application/x-www-form-urlencoded` - 以默认编码进行发送
     - 写法类似于 `queryString` ，不过没有 `?`，以 `&` 进行连接

  ```javascript
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(`key1=val1&key2=val2`); // -> { key1: 'val1', key2: 'val2' }
  ```

  3. `multipart/form-data` - 以二进制编码进行发送 - 多用于发送文件等内容：[FromData](#fromData)
  4. `application/json` - 以 `json` 编码进行发送
  
  ```javascript
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
      key1: 'val1',
      key2: 'val2'
  }));
  // -> { key1: 'val1', key2: 'val2' }
  ```



### 返还信息 - [XMLHttpRequest.response](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/response)

+ 获取返还头信息

  1. `xhr.getAllResponseHeaders()` - 获取所有信息
  2. `xhr.getResponseHeader()` - 获取指定信息，例：`xhr.getResponseHeader('Content-Type')`

+ 获取返还正文

  1. `xhr.response` - 获得 `ArrayBuffer`、`Blob`、`Document`、`Object` 或 `DOMString` 形式的响应数据
  2. `xhr.responseText` - 获得字符串形式的响应数据
  3. `xhr.responseXML` - 获得 XML 形式的响应数据
  4. `xhr.responseURL` - 获得 序列化URL
     - 如果URL为空则返回空字符串
     - 如果URL有锚点，则位于URL # 后面的内容会被删除
     - 如果URL有重定向，`responseURL` 的值会是经过多次重定向后的最终 URL

+ 注意：

  + 获取返还正文需要后台正确写入响应头 `Content-Type`
  + 如后台响应头 `Content-Type` 没写或者书写错误前端也可以进行重写修改

  ```javascript
  xhr.overrideMimeType() // 重写 Content-Type
  ```

  

### <span id="formData">FromData</span>

+ FormData对象用以将数据编译成键值对，以便用 `XMLHttpRequest` 来发送数据
+ 其主要用于发送表单数据，但亦可用于发送带键数据(keyed data)，而独立于表单使用
+ 如果表单 `enctype` 属性设为 `multipart/form-data`，则会使用表单的 `submit()` 方法来发送数据，从而，发送数据具有同样形式

```javascript
const form = new FormData();
// FormData 对象可添加多个键，这里第一个键是 input[type=file] 的files[0]
form.append('img', file);
form.append('name', '图片');

const xhr = new XMLHttpRequest();
xhr.open('post', '/upload', true);
xhr.send(form); // send() 内正文提交
```



### ajax 属性及事件钩子

1. `xhr.readyState` (只读) - 返回 一个无符号短整型（`unsigned short`）数字，代表请求的状态码

| 值   |        状态        |                        描述                         |
| ---- | ---------------- | ------------------------------------------------- |
| 0  |      `UNSENT`      |        代理被创建，但尚未调用 open() 方法。         |
| 1  |      `OPENED`      |              `open()` 方法已经被调用。              |
| 2  | `HEADERS_RECEIVED` | `send()` 方法已经被调用，并且头部和状态已经可获得。 |
| 3  |     `LOADING`      |   下载中； `responseText` 属性已经包含部分数据。    |
| 4  |       `DONE`       |                  下载操作已完成。                   |

2. `xhr.status` - 返回 `XMLHttpRequest` 响应中的数字状态码

| HTTP状态码 | 描述                                                   |
| :--------: | ------------------------------------------------------ |
|    100     | 继续。继续响应剩余部分，进行提交请求                   |
|    200     | 成功                                                   |
|    301     | 永久移动。请求资源永久移动到新位置                     |
|    302     | 临时移动。请求资源零时移动到新位置                     |
|    304     | 未修改。请求资源对比上次未被修改，响应中不包含资源内容 |
|    401     | 未授权，需要身份验证禁止。请求被拒绝                   |
|    403     | 禁止。请求被拒绝                                       |
|    404     | 未找到，服务器未找到需要资源                           |
|    500     | 服务器内部错误。服务器遇到错误，无法完成请求           |
|    503     | 服务器不可用。临时服务过载，无法处理请求               |

3. `xhr.onreadystatechange` - 当 `readyState` 属性发生变化时触发
   - 这个方法不该用于同步的requests对象
   - 当一个 `XMLHttpRequest` 请求被 `abort()` 方法取消时，其对应的 `readystatechange` 事件不会被触发

```javascript
const xhr = new XMLHttpRequest();
xhr.open('post', '/demo', true);
xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        console.log(this.responseText);
    }
}
xhr.send();
```

4. `xhr.timeOut` - 最大请求时间（毫秒）
   - 一个无符号长整型（`unsigned long`）数字
   - 若超出该时间，请求会自动终止
5. `XMLHttpRequestEventTarget.ontimeout` - 当请求超时调用的 `EventHandler`
6. `xhr.upload` - **返回一个** `XMLHttpRequestUpload` 对象，用来表示上传的进度

| 事件          | 相应属性的信息类型                                           |
| ------------- | ------------------------------------------------------------ |
| `onloadstart` | 获取开始                                                     |
| `onprogress`  | 数据传输进行中<br />        event.total：需要传输的总大小<br />        event.loaded :当前上传的文件大小 |
| `onabort`     | 获取操作终止                                                 |
| `onerror`     | 获取失败                                                     |
| `onload`      | 获取成功                                                     |
| `ontimeout`   | 获取操作在用户规定的时间内未完成                             |
| `onloadend`   | 获取完成（不论成功与否）                                     |



### 示例

[Demo](https://github.com/milk0v0/xhrDemo)
