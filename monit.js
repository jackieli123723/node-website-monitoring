var user = process.env.USER
var pass = process.env.PASS
var mailer        = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
//邮件端口和登录
var transport = mailer.createTransport(smtpTransport({
      host: 'smtp.163.com',
      port: 465,
      secure: true,
      auth: {
        user: user,
        pass: pass
      }
}));
var http = require("http");
var url = 'http://gm.test.dragonest.com/';
// var url = 'http://localhost:7100'
var title='西门互联xxxxxx管理平台';
var status = 'success';//控制颜色和图片
var timestamp = new Date().getTime();
//全局否则一直502 拒绝访问的的也是502
var tableString = {
    headerInfo:'',
    webInfo:'',
    list:''
  }

var mailerFlag = false;
var startTime = Date.now();
var endTime
function getDateSplit(timstamp) {
    var date = new Date(timstamp);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var today = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (typeof timstamp=="string") {
        return timstamp;
    }
    if (month < 10) { month = "0" + month;}
    if (today < 10) { today = "0" + today;}
    if(hour<10){ hour="0"+hour;}
    if(minute<10){minute="0"+minute;}
    if(second<10){second="0"+second;}
    return date.getFullYear() + "年"+ month + "月"+ today + "日"+ hour+ "时" + minute + "分"+ second + "秒";
}


//获取服务的宕机时长并且格式化
function getTimeDiff(endTimeMinusStartTime){
var total =parseInt(endTimeMinusStartTime /1000);
var day = parseInt(total / (24*60*60));//计算整数天数
var afterDay = total - day*24*60*60;//取得算出天数后剩余的秒数
var hour = parseInt(afterDay/(60*60));//计算整数小时数
var afterHour = total - day*24*60*60 - hour*60*60;//取得算出小时数后剩余的秒数
var min = parseInt(afterHour/60);//计算整数分
var afterMin = total - day*24*60*60 - hour*60*60 - min*60;//取得算出分后剩余的秒数

var dayString
var hourString
var minString
var afterMinString

if(day){
  dayString = day+ "天"
}else{
  dayString = ''
}

if(hour){
  hourString = hour+ "小时"
}else{
  hourString = ''
}


if(min){
  minString = min+ "分钟"
}else{
  minString = ''
}

if(afterMin){
  afterMinString  = afterMin + "秒";
}else{
  afterMinString = ''
}

return dayString + hourString + minString + afterMinString
//1小时22分钟21秒"
}


function getWebMonitHtml(url,title,status,timestamp,info){
  //url  == web site
  //title -- 监控标题
  //status -- 成功失败颜色区分
  //timestamp -- 时间
  //info --信息
  //邮件的两种颜色状态
  // #319400 == success
  // #d4350e  == error

  var color = ''

  var statusCodeError
// isNaN('ee')
// true
  if(!isNaN(info)){
      statusCodeError = 502
  }else{
      statusCodeError = 'DNS_PROBE_FINISHED_NXDOMAIN'
  }


  if(status == 'error'){
    color = '#d4350e'
    tableString.headerInfo = '无法访问'
    tableString.webInfo = '无法访问您的服务器'
    tableString.list = `
          <tr>
              <td width="30" height="30" align="center" valign="top"><img src="http://oizl669mw.bkt.clouddn.com/icon_${status}_time.png"></td>
              <td width="100" height="30" align="center" valign="top">故障时间：</td>
              <td height="30" align="left" valign="top">${getDateSplit(timestamp)}</td>
          </tr>
          <tr>
              <td width="30" height="30" align="center" valign="top"><img src="http://oizl669mw.bkt.clouddn.com/icon_${status}_reason.png"></td>
              <td width="100" height="30" align="center" valign="top">故障原因：</td>
              <td align="left" valign="top">服务器状态码:${statusCodeError}</td>
          </tr>
             <tr>
              <td width="30" height="30" align="center" valign="top"><img src="http://oizl669mw.bkt.clouddn.com/icon_${status}_info.png"></td>
              <td width="100" height="30" align="center" valign="top">错误信息：</td>
              <td align="left" valign="top">${info == 502 ? '502 Bad Gateway nginx' : info}</td>
          </tr>
    `
  }


  if(status == 'success'){
    color = '#319400'
    endTime = Date.now();
    tableString.headerInfo = '恢复正常'
    tableString.webInfo = '连接正常'
    tableString.list = `
            <tr>
                <td width="30" height="30" align="center" valign="top"><img src="http://oizl669mw.bkt.clouddn.com/icon_${status}_time.png"></td>
                <td width="100" height="30" align="center" valign="top">故障时间：</td>
                <td height="30" align="left" valign="top">${getDateSplit(timestamp)}</td>
            </tr>
              <tr>
                <td width="30" height="30" align="center" valign="top"><img src="http://oizl669mw.bkt.clouddn.com/icon_${status}_time_ok.png"></td>
                <td width="100" height="30" align="center" valign="top">恢复时间：</td>
                <td height="30" align="left" valign="top">${getDateSplit(Date.now())}</td>
            </tr>
              <tr>
                <td width="30" height="30" align="center" valign="top"><img src="http://oizl669mw.bkt.clouddn.com/icon_${status}_time_hourglass.png"></td>
                <td width="100" height="30" align="center" valign="top">宕机时长：</td>
                <td height="30" align="left" valign="top">${getTimeDiff(endTime - startTime)}</td>
            </tr>
            <tr>
                <td width="30" height="30" align="center" valign="top"><img src="http://oizl669mw.bkt.clouddn.com/icon_${status}_reason.png"></td>
                <td width="100" height="30" align="center" valign="top">故障原因：</td>
                <td align="left" valign="top">无法连接服务器</td>
            </tr>
               <tr>
                <td width="30" height="30" align="center" valign="top"><img src="http://oizl669mw.bkt.clouddn.com/icon_${status}_server.png"></td>
                <td width="100" height="30" align="center" valign="top">服务状态：</td>
                <td align="left" valign="top">连接正常</td>
            </tr>
    `
  }



  var str = `
          <div id="container" style="max-width:800px;margin:0 auto;">
            <table border="0" cellspacing="0" cellpadding="1" style="width:100%;margin:0 auto;font-family: &quot;Helvetica Neue&quot;, &quot;Luxi Sans&quot;, &quot;DejaVu Sans&quot;, Tahoma, &quot;Hiragino Sans GB&quot;, STHeiti, &quot;Microsoft YaHei&quot;, Arial, sans-serif;box-shadow:0 0 20px #777;">
                <tbody><tr>
                    <td  style="padding-left:20px;color:#ffffff;font-weight:bold;font-size:40px;background:${color}" height="60">
                        ${title}监控
                    </td>
                </tr>
                <tr>
                    <td  style="padding:20px;background:#fff">
                        <table border="0">
                            <tbody>
                                <tr>
                                    <td>
                                        <img src="http://oizl669mw.bkt.clouddn.com/icon_${status}_header.png">
                                    </td>
                                    <td>
                                        <p style="font-weight: bold;font-size:22px;margin:10px;padding:0;"> 您的网站.(${url})${tableString.headerInfo}</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="padding:0;background-color:#fff;">
                        <table border="0" cellspacing="0" cellpadding="1">
                            <tbody><tr>
                                <td width="15" style="padding:0;background:${color}"></td>
                                <td style="color: ${color} ;padding:10px; font-weight: bold;font-size:20px;">故障情况</td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>
                <tr>
                    <td  style="font-size:16px;padding-left:30px;padding-top:10px;padding-bottom:15px;background:#fff">
                        <table width="90%" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                         ${tableString.list}
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="padding:0;background-color:#fff;">
                        <table border="0" cellspacing="0" cellpadding="1">
                            <tbody><tr>
                                <td  width="15" style="padding:0;background:${color}"></td>
                                <td style="color: ${color} ;padding:10px; font-weight: bold;font-size:20px;">各线路连接</td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>
                <tr>
                    <td  style="padding-top:10px;padding-left:30px;padding-bottom:10px;font-size:16px;background:#fff">
                        <table width="90%" border="0" cellspacing="0" cellpadding="0">
                            <tbody><tr>
                                <td width="30" height="30" align="center" valign="top">
                                    <img src="http://oizl669mw.bkt.clouddn.com/icon_${status}_status.png">

                                </td>
                                <td width="100" height="30" align="center" valign="top">深圳联通：</td>
                                <td align="left" valign="top">${tableString.webInfo}</td></tr>
                            <tr>
                                <td width="30" height="30" align="center" valign="top">
                                    <img src="http://oizl669mw.bkt.clouddn.com/icon_${status}_status.png">

                                </td>
                                <td width="100" height="30" align="center" valign="top">上海电信：</td>
                                <td align="left" valign="top">${tableString.webInfo}</td></tr>
                        </tbody></table>

                    </td>
                </tr>

                <tr>
                    <td colspan="2" style="padding:0;background-color:#fff;">
                        <table border="0" cellspacing="0" cellpadding="1">
                            <tbody><tr>
                                <td  width="15" style="padding:0;background:${color}"></td>
                                <td style="color: ${color} ;padding:10px; font-weight: bold;font-size:20px;">如何解决宕机</td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>

                <tr>
                    <td colspan="2" style="padding:20px;background-color:#fff;">
                        <ul>
                            <li style="line-height:1.5">检查服务器服务的进程是否正常</li>
                            <li style="line-height:1.5">检查是否有第三方模块安装失败</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="padding:0;background:#fff">
                        <table border="0" cellspacing="0" cellpadding="1">
                            <tbody><tr>
                                <td  width="15" style="padding:0;background:${color}"></td>
                                <td style="color: ${color} ;padding:10px; font-weight: bold;font-size:20px;">友情提醒</td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="padding:10px;font-size:16px;background:#fff">
                        <ul>
                            <li style="line-height:1.5"> <a target="_blank" style="text-decoration:none" href="mailto:lilidong@ilongyuan.com.cn">如有紧急情况请联系管理员邮箱：lilidong@ilongyuan.com.cn</a> </li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="padding:0;background-color:#fff;text-align:right;padding:20px;font-size:16px;"> © 2017 版权所有.West Gate Internet </td>
                </tr>
            </tbody>
           </table>
        </div>
  `
  return str
}


function mailOptionsWebMonitInfo(url,title,status,timestamp,info){
  var mailOptionsWebMonit = {
    from: `${title}网站异常监控 <${user}>`, // 如果不加<xxx@xxx.com> 会报语法错误
    to: '380863274@qq.com', // list of receivers
    subject: `${title}测试服务器${status == 'error' ? '异常请及时排查!' : '恢复正常'}`, // Subject line
    html: getWebMonitHtml(url,title,status,timestamp,info)
  };
  return mailOptionsWebMonit
}

//调试6s正常1分钟
//调试3min正常30分钟
var timerId = setTimeout(function () {
 webSiteMonitCheck();
}, 60*1000);


function webSiteMonitCheck() {
    console.log(`${title}网站异常监控.....`);

    http.get(url, function (res) {

        const statusCode  = res.statusCode;
        let error;
        if (statusCode !== 200) {
          error = new Error('请求失败.' +  `Status Code: ${statusCode}`);
          //发邮件监控报错502 可能是pm2 stop 或者error导致的
          transport.sendMail(mailOptionsWebMonitInfo(url,title,'error',timestamp,statusCode), function(error, info){
            if(error){
              console.log(error);
            }else{
              console.log('Message sent: ' + info.response);
              console.log("状态拒绝",tableString.list)
            }
          });

          timerId = setTimeout(function () { webSiteMonitCheck(); }, 30 * 60 * 1000);//挂掉之后就半小时检查一次

        }

        if (error) {
          console.error('捕获',error.message);
          res.resume();
          return;
        }

        res.setEncoding('utf8');
        let body = ''
        res.on("data", function (data) {
          body +=data
         });
        res.on("end", function () {
          //正常 try 区块
          try {
            //注释解决json解析错误,Unexpected token in JSON at position
            //const parsedData = JSON.parse(body);
             //  console.log(body);
            //恢复正常
            if(!mailerFlag && body !== undefined){
                transport.sendMail(mailOptionsWebMonitInfo(url,title,'success',timestamp,'网站恢复正常'), function(error, info){
                  if(error){
                    console.log(error);
                  }else{
                    console.log('Message sent: ' + info.response);
                    console.log("恢复连接",tableString.list)
                    mailerFlag = true
                  }
                });
            }

            timerId = setTimeout(function () { webSiteMonitCheck(); }, 60*1000);//正常情况下1分钟检查一次
          } catch (e) {
            console.error(e.message);
          }

        });
    }).on("error", function (e) {
      //这里捕获不能正常连接的错误
        console.error(`错误信息: ${e.message}`);
      //发邮件监控报错
        transport.sendMail(mailOptionsWebMonitInfo(url,title,'error',timestamp,`${e.message}`), function(error, info){
          if(error){
            console.log(error);
          }else{
            console.log('Message sent: ' + info.response);
            console.log("拒绝连接",tableString.list)
          }
        });

        timerId = setTimeout(function () { webSiteMonitCheck(); }, 30 * 60 * 1000);//挂掉之后就半小时检查一次
    });
}
