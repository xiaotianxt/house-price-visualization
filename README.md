
# 小区房价可视化平台

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
基于链家小区二手房月成交价格, 可视化展示房屋价格走势, 支持多种方式查询.

在线查看[house.xiaotianxt.cn](https://house.xiaotianxt.cn)
## 运行截图

![使用截图](https://tva1.sinaimg.cn/large/008i3skNly1gr9kanmu8aj31dd0u0kjr.jpg)


## 安装

### 前端
使用`npm`安装依赖, 利用`parcel-bundler`打包.

开发: 
```bash 
  cd front
  npm install --dependencies
  npm start
```

打包:
```bash
  parcel build index.html
```

### 后端
使用`python flask`响应请求.

开发:
```bash
  pip3 install pymongo flask flask-cors
  flask run --host=0.0.0.0
```

部署:
使用`uWSGI` + `NGINX`部署.

### 数据库部署

基于[@jumper2014](https://github.com/jumper2014)开发的[链家网爬虫](https://github.com/jumper2014/lianjia-beike-spider), 爬取小区数据并存储在mongodb中.

## 作者

- [@xiaotianxt](https://www.github.com/xiaotianxt)

