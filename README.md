#### 这是一个简化版的 create-react-app
这是一个100行代码的简化版的` create-react-app `，去除了环境检测、版本检测、离线包检测等代码，只保留了创建` react ` 项目的核心代码。只用作学习，其他用途不承担任何风险责任。线上项目，请使用官方的` create-react-app `

#### 功能介绍：
* 其他的可选参数全部会忽略，像` simple-craete-react-app --info `会无视的。
* 只能使用yarn安装依赖，所以要保证电脑有yarn环境。
* 不支持离线包react-scripts的安装
* 不能选择react-scripts的版本，只能安装默认的
* 只能在当前目录下创建新项目

#### 用法
```
# 先要全局安装
npm install -g simple-create-react-app

# 然后在你想要创建react项目的地方运行：
simple-create-react-app my-app

# 等待几分钟后
cd my-app && npm start
```

如果你想要下载代码在本地运行的话可以这样：
```
# 下载代码：
git clone 'https://github.com/zhanyuzhang/simple-create-react-app.git'

# 进入到根目录，安装依赖：
yarn

# 然后创建一个项目：
npm start my-app

# 等待执行完毕后，执行：
cd my-app && npm start
```

