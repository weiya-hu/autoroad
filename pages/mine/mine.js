// pages/mine/mine.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',//屏幕高度
    width: '',//屏幕宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let departs = wx.getStorageSync('departs').map(val => val.departName)
    this.setData({
      height: app.globalData.height,
      width: app.globalData.width,
      departs: departs.join('、'),//用户部门
      roles: wx.getStorageSync('roles').join('、'),//岗位
      userimg: wx.getStorageSync('userimg'),//用户头像
      userinfo: wx.getStorageSync('userinfo')
    })
  },
  toforget:function(){
    wx.navigateTo({
      url: '../forget/forget',
    })
  },
  tologin: function () {
    let token = wx.getStorageSync('token');
    app.questUrl('jeecg-boot/sys/logout', 'get', token).then(function(res){
      console.log(res)
      if(res.data.code===200){
        wx.removeStorage({ key: 'token' });
        wx.removeStorage({ key: 'userinfo' });
        wx.removeStorage({ key: 'departs' });
        wx.removeStorage({ key: 'roles' });
        wx.removeStorage({ key: 'userimg' });
        wx.reLaunch({
          url: '../login/login',
        })
      }
    })
    
  },
  toabout: function () {
    wx.navigateTo({
      url: '../about/about',
    })
  },
  userimgload(){

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