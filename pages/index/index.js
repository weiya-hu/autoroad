const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'',//屏幕高度
    width:'',//屏幕宽度
    messagelist:{},
    username:'',
    userimg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.height();
    this.start()
  },
  //获取底部高度
  height: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        app.globalData.height = res.windowHeight
        app.globalData.width = res.windowWidth; 
        that.setData({
          height: app.globalData.height,
          width: app.globalData.width
        })
      }
    })
  },
  start:function(){
    this.setData({
      username: wx.getStorageSync('userinfo').realname,
      userimg: wx.getStorageSync('userimg')
    })
  },
  messagelist(){
    let token = wx.getStorageSync('token'), that = this;
    app.questUrl('jeecg-boot/sys/annountCement/listByUser', 'get', token).then(function (res) {
      console.log(res)
      if (res.data.code === 0) {
        that.setData({
          messagelist: res.data.result
        })
        let textnum = String(res.data.result.anntMsgTotal + res.data.result.repairMsgTotal + res.data.result.sysMsgTotal)
        if (textnum > 0) {
          wx.setTabBarBadge({
            index: 0,
            text: String(res.data.result.anntMsgTotal + res.data.result.repairMsgTotal + res.data.result.sysMsgTotal)
          })
          wx.setStorageSync('textnum', textnum)
        } else {
          wx.removeTabBarBadge({
            index: 0,
          });
        }
      }
    })
  },
  toproject: function (e) {
    let title = e.currentTarget.dataset.tit
    wx.navigateTo({
      url: '../project/project?title='+title,
    })
  },
  tostatis(){
    wx.navigateTo({
      url: '../statis/statis',
    })
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
    this.messagelist()
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