# README
该模板在json-server的基础上提供了token及文件上传的能力，修改了数据返回的统一格式。

## 数据返回格式
```json
{
  "code": "业务代码",
  "msg": "信息",
  "data": 数据
}
```

## 项目启动

### 安装模块
项目第一次启动需要安装模块
```bash
npm i 
# 或者
yarn 
```

### 启动项目
```bash
npm start
```

## 接口
提供登录、注册以及文件上传接口，对应的接口为


### GET /users 
登录接口，用于登录，获取用户信息，可以获取到除密码外的所有信息

### POST /users
注册接口，用于注册用户

### POST /upload
文件上传接口，需要使用`form-data`进行上传，上传成功后返回文件地址

## 权限验证

除`/users`、`/upload`外，所有的接口都需要携带token进行请求，token放在headers中，名字为`authorization`，可以在`config.js`中进行配置。修改`exports.tokenPropName = ""`为对应的想要使用key即可。

所有的token问题都会返回状态码为`401`
