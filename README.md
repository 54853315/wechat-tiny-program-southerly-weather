# “南风天来了” — 微信小程序

###小程序简介

本小程序旨在南风天来之前，通过[模板消息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/template-message.html)提醒用户注意气候改变。在我们桂林（南方）南风天是非常可怕得气候，墙壁都是水珠，楼道湿滑，玻璃起雾，山雾弥漫。有可能出门上班，家里未关窗，结果突然转风了，晚上回到家被褥已湿……

也是我第二个练手的小程序。

###开源原因

在我开发完第一阶段到达终点时，遇到了一个坎儿。第一阶段就是小程序能够获取授权并成功订阅，而服务器端存储数据和校验有效性再通过队列获取天气数据和推送模板消息。已经做好模板消息推送，服务器端推送后发现小程序`<form>`里获取的`form-id`只能使用1次，且7天有效。因此我要么通过多次获取`form-id`的[方式](https://www.jianshu.com/p/84dd9cd6eaed)多发几条，但是有效期仍然是7天，需要用户第7天打开小程序重新订阅才行。要么就是改成用短信通知用户，增加订阅的费用。但这些都不是我最初设想的“只需要在小程序里订阅，就能不打扰用户生活的情况下，每天在用户使用的微信里提醒用户即可”的创意了。

所以毅然决然的开源吧。

第一阶段的功能不包含：续费订阅。

##第三方清单

- [MinUI](https://meili.github.io/min/index.html)
- [腾讯位置服务](https://lbs.qq.com)
- [和风天气API--空气质量逐小时预报](https://www.heweather.com/documents/api/s6/air-hourly)（服务器端）

 ![](https://img.shields.io/badge/License-MIT-lightgrey.svg) ![](https://img.shields.io/badge/%E5%9F%BA%E7%A1%80%E5%BA%93-2.6.0%2B-brightgreen.svg) 

![](http://www.crazyphper.com/wechat_app_preview/weather_flow.gif)

### 安装方法

####安装MinUI

1. 创建一个新的空的目录
2. 安装 Min 的环境 `$ npm install -g @mindev/min-cli`
3. Clone MinUI 仓库到本地；
4. 安装依赖 `$ npm install`
5. 在 MinUI 根目录下执行 `$ min dev`，生成 dist/ 目录；
6. 将本git迁出至dist/目录内。
7. Done~

### 开源协议

本项目基于 [MIT](http://opensource.org/licenses/MIT) License，请自由的享受、参与开源。


### ○ 更新记录

#### v1.0.0（2019.2.20）

- 初始开源版本
