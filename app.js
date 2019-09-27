//app.js
App({
  questUrl(url,method,token,data) {
    wx.showLoading({
      title: '加载中...',
    })
    //返回一个Promise对象
    return new Promise(function (resolve, reject) {
      wx.request({
        url: "https://kaijin.zhoumc.cn/" + url,
        // url: "http://192.168.100.135:8080/" + url,
        method:method,
        data: data,
        //在header中统一封装报文头，这样不用每个接口都写一样的报文头定义的代码
        header: {
          "Content-Type": "application/json",
          // 'content-type': 'application/x-www-form-urlencoded'  ,
          "X-Access-Token":token
          // "X-Access-Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NjE3MDg1NDIsInVzZXJuYW1lIjoiYWRtaW4ifQ.5imRP4qrUWSfTqFpnWuF6k7KepWWUedebRKnFnByGR00'
        },
        success: function (res) {
          console.log('ssuccess');
          wx.hideLoading();
          //这里可以根据自己项目服务端定义的正确的返回码来进行，接口请求成功后的处理，当然也可以在这里进行报文加解密的统一处理
          
          
          if (res.data) {
            resolve(res);
            // console.log(JSON.stringify(res) )
            if(res.data.status==500){
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
              setTimeout(function(){
                wx.removeStorage({ key: 'token' });
                wx.removeStorage({ key: 'userinfo' });
                wx.removeStorage({ key: 'departs' });
                wx.removeStorage({ key: 'roles' });
                wx.removeStorage({ key: 'userimg' });
                wx.reLaunch({
                  url: '/pages/login/login',
                })
              },1500)
              
            }
          } else {
            //如果出现异常则弹出dialog
            wx.showModal({
              title: '提示',
              content: res.data.errCode + '系统异常',
              confirmColor: '#118EDE',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                }
              }
            });
          }
        },
        fail: function (res) {
          console.log('ffail');
          wx.hideLoading();
          wx.showToast({
            title: '服务器暂时无法连接',
            icon: 'loading',
            duration: 2000
          })
          reject(res);
        },
        complete:function(res){
          console.log('ccomplete');
          console.log(res)
        }
      });
    });
  },
  questUrl_no(url, method, token, data) {
    //返回一个Promise对象
    return new Promise(function (resolve, reject) {
      wx.request({
        url: "https://kaijin.zhoumc.cn/" + url,
        // url: "http://192.168.100.135:8080/" + url,
        method: method,
        data: data,
        //在header中统一封装报文头，这样不用每个接口都写一样的报文头定义的代码
        header: {
          "Content-Type": "application/json",
          "X-Access-Token": token
          // "X-Access-Token": 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NjE3MDg1NDIsInVzZXJuYW1lIjoiYWRtaW4ifQ.5imRP4qrUWSfTqFpnWuF6k7KepWWUedebRKnFnByGR00'
        },
        success: function (res) {
          //这里可以根据自己项目服务端定义的正确的返回码来进行，接口请求成功后的处理，当然也可以在这里进行报文加解密的统一处理


          if (res.data) {
            resolve(res);
            console.log(res)
            if (res.data.status == 500) {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
              setTimeout(function () {
                wx.removeStorage({ key: 'token' });
                wx.removeStorage({ key: 'userinfo' });
                wx.removeStorage({ key: 'departs' });
                wx.removeStorage({ key: 'roles' });
                wx.removeStorage({ key: 'userimg' });
                wx.reLaunch({
                  url: '/pages/login/login',
                })
              }, 1500)

            }
          } else {
            //如果出现异常则弹出dialog
            wx.showModal({
              title: '提示',
              content: res.data.errCode + '系统异常',
              confirmColor: '#118EDE',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                }
              }
            });
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '服务器暂时无法连接',
            icon: 'loading',
            duration: 2000
          })
          reject(res);
        }
      });
    });
  },
  questUrl_noloading(url, data) {
    //返回一个Promise对象
    return new Promise(function (resolve, reject) {
      wx.request({
        url: "https://kaijin.zhoumc.cn/" + url,
        // url: "http://192.168.100.135:8080/" + url,
        method: "post",
        data: data,
        //在header中统一封装报文头，这样不用每个接口都写一样的报文头定义的代码
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          //这里可以根据自己项目服务端定义的正确的返回码来进行，接口请求成功后的处理，当然也可以在这里进行报文加解密的统一处理
          if (res.data) {
            resolve(res);
          } else {
            //如果出现异常则弹出dialog
            wx.showModal({
              title: '提示',
              content: res.data.errCode + '系统异常',
              confirmColor: '#118EDE',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                }
              }
            });
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '服务器暂时无法连接',
            icon: 'loading',
            duration: 2000
          })
          reject(res);
        }
      });
    });
  },
  globalData: {
    userInfo: null,
    height:'',//屏幕高度
    width:'',//屏幕宽度
    heightall:'',//屏幕总高度
    relavideo:[],//相关视频
    userinfo:'',//用户信息
    departs:[],//用户部门
    roles:[],//岗位
    master:'https://kaijin.zhoumc.cn/jeecg-boot/sys/common/view/',
    url:'https://kaijin.zhoumc.cn/',
    // master: 'http://192.168.100.135:8080/jeecg-boot/sys/common/view/',
    // url: 'http://192.168.100.135:8080/',
    userimg:'',//用户头像
    messageitem:{},//消息详情item
  }
})