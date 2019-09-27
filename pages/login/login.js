// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false,//登录的loading是否显示
    passwordchashow:false,//密码输入框的叉是否显示
    usernamechashow: false,//用户名输入框的叉是否显示
    username:'',
    password:'',
    usernamefocus:false,
    passwordfocus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.start()
  },
  start:function(){
    wx.showLoading({
      title: '',
    })
    let token = wx.getStorageSync('token')
    console.log(token)
    wx.hideLoading();
    if(token){
      wx.switchTab({
        url: '../index/index',
      })
    }
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        app.globalData.heightall = res.windowHeight
      }
    })
  },
  //表单提交
  formSubmit:function(e){
    console.log(e.detail.value)
    let val = e.detail.value,that=this;
    console.log(val.username, val.password)
    let data={
      username: val.username,
      password: val.password,
      remember_ma:true
    }
    if (this.trim(val.username) == ''){
      wx.showToast({
        title: '账号不能为空',
        icon: 'none'
      })
    }else if(this.trim(val.password) == '') {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
    }else{
      this.setData({loading: true})
      app.questUrl_noloading('jeecg-boot/sys/login', data).then(function (res) {
        that.setData({loading: false})
        if (res.data.code === 200) {
          wx.setStorageSync('token', res.data.result.token);
          wx.setStorageSync('userinfo', res.data.result.userInfo);
          wx.setStorageSync('departs', res.data.result.departs);
          wx.setStorageSync('roles', res.data.result.roles);
          if (res.data.result.userInfo.avatar){
            wx.setStorageSync('userimg', app.globalData.master + res.data.result.userInfo.avatar);
          } 
          wx.switchTab({
            url: '../index/index'
          })

          wx.showToast({
            title: '登录成功',
            icon: 'none'
          })
        }else{
          wx.showToast({
            title: '账号或密码错误',
            icon: 'none'
          })
        }
      })
    }     
  },
  userinput:function(e){
    if(e.detail.value.length>0){
      this.setData({
        usernamechashow:true
      })
    }
  },
  usernameblur:function(){
    this.setData({
      usernamechashow: false
    })
  },
  usernamefocus: function (e) {
    if (e.detail.value.length>0){
      this.setData({
        usernamechashow: true
      })
    }
  },
  deletee:function(e){
    console.log(e)
    let val = e.currentTarget.dataset.val
    if(val=='username'){
      this.setData({
        username: '',
        usernamefocus:true
      })
    } else if (val == 'password'){
      this.setData({
        password: '',
        passwordfocus:true
      })
    }
    
  },
  toforget:function(){
    wx.navigateTo({
      url: '../forget/forget',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  next:function(){
    this.setData({
      passwordfocus:true
    })
  },
  trim:function(str){
    return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
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