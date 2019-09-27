// pages/forget/forget.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',//屏幕高度
    yzm:'获取验证码',
    time:'60',
    yzmswitch:true,
    phonenum:'',
    username:'',
    passwordtipshow:false,
    passwordtipagshowchina:false,
    passwordtipagshow: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    this.height()
  },
  height: function (){//获取底部高度
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          height: res.windowHeight,
          width: res.windowWidth
        })
      }
    })
  },
  getyzm(){
    let tel = this.data.phonenum, token = wx.getStorageSync('token'), that = this,username=this.data.username;
    console.log(tel)
    console.log(!(/^1[34578]\d{9}$/.test(tel)))
    if(username==''){
      wx.showToast({
        title: '请填写您的账号',
        icon: 'none'
      })
    }else if (tel==''){
      wx.showToast({
        title: '请输入电话号码',
        icon: 'none'
      })
    } else if (!(/^1[34578]\d{9}$/.test(tel))) {
      wx.showToast({
        title: '请输入正确的电话号码',
        icon: 'none'
      })
    }else{
      let yzm = '重新发送(' + this.data.time + ')';
      if (this.data.yzmswitch){
        
        let data={
          username:username,
          phone:tel
        }
        app.questUrl('jeecg-boot/sys/user/sendMessageCode','post',token,data).then(function (res) {
          console.log(res)
          if(res.data.code==500){
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          } else if (res.data.code==200){
            that.setData({
              yzmswitch: false,
              yzm: yzm
            })
            let timer = setInterval(function () {
              let time = that.data.time - 1;
              let yzm = '重新发送(' + time + ')';
              that.setData({
                time: time,
                yzm: yzm
              })
              if (that.data.time <= 0) {
                clearInterval(timer)
                that.setData({
                  yzm: '获取验证码',
                  time: '60',
                  yzmswitch: true
                })
              }
            }, 1000)
          }  
        })
      }
    }    
  },
  phonetap(e){
    this.setData({
      phonenum: e.detail.value
    })
  },
  usernametap(e) {
    this.setData({
      username: e.detail.value
    })
  },
  passwordtap(e){
    let password=e.detail.value
    var regExp = /^[\u4e00-\u9fa5]+$/
    let passarr=password.split('');
    this.setData({
      password: password
    })
    for(let i=0;i<passarr.length;i++){
      console.log(regExp.test(passarr[i]));
      this.setData({
        passwordtipshow: regExp.test(passarr[i])
      })
    }
  },
  passwordtapag(e) {
    let password = e.detail.value,passwordbf=this.data.password;
    var regExp = /^[\u4e00-\u9fa5]+$/
    let passarr = password.split(''), passarrbf = passwordbf.split('');
    for (let i = 0; i < passarr.length; i++) {
      // console.log(regExp.test(passarr[i]));
      if (passarr[i] == passwordbf[i] && passarr.length <= passarrbf.length){
        this.setData({
          passwordtipagshow: false
        })
      }else{
        this.setData({
          passwordtipagshow: true
        })
      }
      this.setData({
        passwordtipshowchina: regExp.test(passarr[i])
      })
    }
  },
  passwordagblur(e){
    console.log(e)
    let password = e.detail.value, passwordbf = this.data.password;
    console.log(password)
    console.log(passwordbf)
    if (password != passwordbf){
      this.setData({
        passwordtipagshow: true
      })
    }else{
      this.setData({
        passwordtipagshow: false
      })
    }
  },
  forgetsubmit:function(e){
    console.log(e)
    if (e.detail.username == '') {
      wx.showToast({
        title: '请填写您的账号',
        icon: 'none'
      })
    } else if (e.detail.phone == '') {
      wx.showToast({
        title: '请输入电话号码',
        icon: 'none'
      })
    } else if (e.detail.yzm == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else if (e.detail.password == '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
    } else if (this.data.passwordtipshow) {
      wx.showToast({
        title: '密码中不能包含汉字',
        icon: 'none'
      })
    } else if (this.data.passwordtipagshow) {
      wx.showToast({
        title: '两次输入的密码不一样',
        icon: 'none'
      })
    }else{
      let data={
        username: e.detail.value.username,
        phone: e.detail.value.phone,
        code: e.detail.value.yzm,
        password: e.detail.value.password
      };
      console.log(data)
      let token =wx.getStorageSync('token')
      app.questUrl('jeecg-boot/sys/user/wechatUpdatePassword', 'put', token, data).then(function (res) {
        console.log(res)
        
        if(res.data.code==200){
          wx.showToast({
            title: res.data.message,
            icon: 'none'
            })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
              })
            }, 1000)
      
        } else if (res.data.code == 500){
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})