// pages/message/message.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',//屏幕高度
    width: '',//屏幕宽度
    messagelist:[],
    nodata:false,
    pageno:1,
    x0: 0,
    y0: 0,
    left0: 0,
    right:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      height: app.globalData.height,
      width: app.globalData.width
    })
    this.init()
  },
  starts(){
    let that = this, token = wx.getStorageSync('token'), messagelist = this.data.messagelist;
    let data={
      pageNo:1,
      pageSize:20   
    }
    app.questUrl('jeecg-boot/system/sysAnnouncementSend/getMyAnnouncementSend', 'get',token,data).then(function (res) {
      console.log(res) 
      that.setData({
        messagelist: res.data.result.records 
      })
      console.log(that.data.messagelist)
      console.log(that.data.messagelist)
      if (that.data.messagelist.length<res.data.result.total){
        that.setData({
          nodata:false,
          pageno:1
        })
      }else{
        that.setData({
          nodata: true,
          pageno: 1
        })
      }
    })
  },
  questpushdown(){
    let that = this, token = wx.getStorageSync('token'), messagelist = this.data.messagelist;
    let data = {
      pageNo: 1,
      pageSize: 20
    }
    app.questUrl('jeecg-boot/system/sysAnnouncementSend/getMyAnnouncementSend', 'get', token, data).then(function (res) {
      console.log(res)
      that.setData({
        messagelist: res.data.result.records
      })
      console.log(that.data.messagelist)
      if (that.data.messagelist.length < res.data.result.total) {
        that.setData({
          nodata: false,
          pageno: 1
        })
      }else{
        that.setData({
          nodata: true,
          pageno: 1
        })
      }
      console.log(that.data.nodata)
    })
  },
  quest(pageno){
    let that = this, token = wx.getStorageSync('token'), messagelist = this.data.messagelist;
    let nodata = this.data.nodata;
    console.log(nodata)
    if(nodata){
      return
    }else{
      let data = {
        pageNo: pageno,
        pageSize: 20
      }
      app.questUrl('jeecg-boot/system/sysAnnouncementSend/getMyAnnouncementSend', 'get', token, data).then(function (res) {
        console.log(res)
        that.setData({
          messagelist: messagelist.concat(res.data.result.records),
          pageno: pageno
        })
        if (that.data.messagelist.length < res.data.result.total) {
          that.setData({
            nodata: false
          })
        } else {
          that.setData({
            nodata: true
          })
        }
      })
    }
  },
  totop:function(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 400
    });
  },
  deletee: function (id) {
    console.log(id);
    let token = wx.getStorageSync('token'), that = this, list = this.data.messagelist;
    app.questUrl('jeecg-boot/system/sysAnnouncementSend/deleteMySysAnnouncement?id='+id,'delete',token).then(function(res){
      console.log(res)
      if(res.data.success){
        list = list.filter((list) => {
          return list.id != id;
        });
        that.setData({
          messagelist: list
        })
      }else{
        wx.showToast({
          title: res.data.message,
          icon:'none'
        })
      }
    })
    
  },
  onMyEvent: function (e) { //右侧滑块的点击事件
    console.log(e)
    var id = e.dataset.id;
    var self = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      success: function (res) {
        if (res.confirm) {
          self.deletee(id); //删除操作
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  init: function () {
    var right = [{
      text: '删除',
      background: 'red',
      color: 'white',
      width: 80,
      handle: (event) => {
        this.onMyEvent(event)
      }
    }]
    this.setData({
      right: right
    })
  },
  tomessagedet: function (e) {
    let messageitem = e.currentTarget.dataset.item,that=this;
    let token=wx.getStorageSync('token')
    app.globalData.messageitem = messageitem
    wx.navigateTo({
      url: './messagedet/messagedet',
      success(res){
        let data = { anntId: messageitem.anntId}
        app.questUrl('jeecg-boot/system/sysAnnouncementSend/editByAnntIdAndUserId','put',token,data).then(function(res){
          console.log(res)
        })
      }
    })
  },
  textnum(){
    let that = this, token = wx.getStorageSync('token');
    app.questUrl('jeecg-boot/sys/annountCement/listByUser', 'get', token).then(function (res) {
      console.log(res)
      if (res.data.code === 0) {
        let textnum = String(res.data.result.anntMsgTotal + res.data.result.repairMsgTotal + res.data.result.sysMsgTotal);
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
        wx.setStorageSync('textnum', textnum)
      }
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
    this.starts();
    this.textnum()
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
    this.questpushdown()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('hdfdkjshj')
    let pageno=this.data.pageno+1
    this.quest(pageno)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})