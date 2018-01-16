# node-website-monitoring
网站异常监控发送邮件及时排查错误修复

## 用法 默认163邮箱

```
//测试
// USER='邮箱' PASS='密码' node monit.js

//服务端
//USER='邮箱' PASS='密码' pm2 start monit.js --name monit --watch

```
## 效果图

> 正常

![列表界面](./ok.png)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjackieli123723%2Fnode-website-monitoring.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjackieli123723%2Fnode-website-monitoring?ref=badge_shield)

> 502

![详情界面](./502.png)


> 拒绝连接

![关于我界面](./refused.png)


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjackieli123723%2Fnode-website-monitoring.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjackieli123723%2Fnode-website-monitoring?ref=badge_large)