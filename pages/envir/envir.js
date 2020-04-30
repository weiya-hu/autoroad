// pages/envir/envir.js
var wxCharts = require('../../utils/wxcharts.js');
const app = getApp();
//每个chart的初始定义
var lineChart = null, lineChart1 = null, lineChart2 = null, lineChart3 = null, lineChart4 = null, lineChart5 = null, lineChart6 = null, lineChart7 = null, lineChart8 = null, lineChart9 = null, lineChart10 = null;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    projectlist: [],//页面标题数据
    currentTab: 0,//当前大标题在第几页
    navScrollLeft: 0,//大标题左滑距离
    navScrollLeftarr1: [], //每个大标题下面小标题左滑的距离
    height: '',//屏幕高度
    windowWidth: '',//屏幕宽度
    indexarr: [],//每个大标题下面点进去小标题的索引
    title: '',//页面标题
    idarr: [],//图表canvasid idarr
    date: [],//date初始值
    dat: {},//dayline接口的参数，保留下做下一次请求的参考
    name: '',//当前小标题name
    chartshow: true,//图表是否显示
    item:{},//当前小标题
    today:'',
    projectlistshow: true,//页面是否有数据
    canvasopacity:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  updateData: function (data,idx,name,unit,max,min) {
    var series = [{
      name: name,
      data: data,
      format: function (val, name) {
        return val;
      }
    }];
    console.log(idx, name, unit, max, min)
    console.log(JSON.stringify(series))
    console.log(data)
    let u='',m='',mi='';
    if (name == '温度') {
      u = '℃';
      m = 50;
    } else if (name == '湿度') {
      u = 'RH';
      m = 90;
    } else if (name == '风速(m/s)' || name == '风速') {
      u = 'M/S';
      m = 8;
    } else if (name == '粉尘') {
      u = 'PPM';
      m = 150;
    } else if (name == '噪声') {
      u = 'dB';
      m = 140;
    } else if (name == 'PM10') {
      u = 'ug/m';
      m = 200;
    } else if (name == 'TSP') {
      u = '';
      m = 140;
    } else if (name == '风力') {
      u = '级';
      m=8;
    } else if (name == '风向') {
      u = '';
      m = 8;
    }else if (name == '气压') {
      u = 'Kpa';
      m = 101;
    } else if (name == 'PM2.5') {
      u = 'ug/m';
      m = 200;
    }else{
      console.log('777777777777777777777777')
      u='';
    }

    switch(idx){
      case 0:
        lineChart.updateData({
          series: series,
        });
        lineChart.opts.yAxis.max=m;
        lineChart.opts.yAxis.title = u;
        console.log(111113333)
        break;
      case 1:
        lineChart1.updateData({
          series: series,
        });
        lineChart1.opts.yAxis.max = m;
        lineChart1.opts.yAxis.title = u;
         break;
      case 2:
        lineChart2.updateData({
          series: series,
        });
        lineChart2.opts.yAxis.max = m;
        lineChart2.opts.yAxis.title = u;
         break;
      case 3:
        lineChart3.updateData({
          series: series,
        });
        lineChart3.opts.yAxis.max = m;
        lineChart3.opts.yAxis.title = u;
        break;
      case 4:
        lineChart4.updateData({
          series: series,
        });
        lineChart4.opts.yAxis.max = m;
        lineChart4.opts.yAxis.title = u;
        break;
      case 5:
        lineChart5.updateData({
          series: series,
        });
        lineChart5.opts.yAxis.max = m;
        lineChart5.opts.yAxis.title = u;
        break;
      case 6:
        lineChart6.updateData({
          series: series,
        });
        lineChart6.opts.yAxis.max = m;
        lineChart6.opts.yAxis.title = u;
        break;
      case 7:
        lineChart7.updateData({
          series: series,
        });
        lineChart7.opts.yAxis.max = m;
        lineChart7.opts.yAxis.title = u;
        break;
      case 8:
        lineChart8.updateData({
          series: series,
        });
        lineChart8.opts.yAxis.max = m;
        lineChart8.opts.yAxis.title = u;
        break;
      case 9:
        lineChart9.updateData({
          series: series,
        });
        lineChart9.opts.yAxis.max = m;
        lineChart9.opts.yAxis.title = u;
        break;
      case 10:
        lineChart10.updateData({
          series: series,
        });
        lineChart10.opts.yAxis.max = m;
        lineChart10.opts.yAxis.title = u;
        break;
    }
    
  },
  onLoad: function (options) {
    this.start()
  },
  //日期更改图表曲线变化函数
  bindDateChange(e) {
    console.log(e.detail.value)
    let dat = {}
    this.setData({
      date: e.detail.value
    })
    let token = wx.getStorageSync('token'), that = this;
    if (this.data.dat) {
      dat = {
        equipmentId: this.data.dat.equipmentId,
        typeId: this.data.dat.typeId,
        date: e.detail.value
      }
    }
    app.questUrl("jeecg-boot/air/dayline", 'post', token, dat).then(function (res) {
      console.log(res)
      let valuelist = [];
      for (let i = 0; i < res.data.result.valueList.length; i++) {
        valuelist.push(res.data.result.valueList[i].value)
      }
      console.log(valuelist)
      // that.updateData(valuelist)
      that.updateData(valuelist, that.data.currentTab, that.data.name, that.data.item.unit, res.data.result.max, res.data.result.min)
      console.log(lineChart.opts.series[0].data)
      let flg = valuelist.find(m => m != null)
      console.log(flg)
      if (flg) {
        that.setData({
          chartshow: true
        })
      } else {
        that.setData({
          chartshow: false
        })
      }
      console.log(that.data.chartshow)
    
    })
  },
  start: function () {
    this.initchart()
    let pages = getCurrentPages(), token = wx.getStorageSync('token'), that = this;
    let id = pages[pages.length - 1].options.id;
    let name = pages[pages.length - 1].options.name;
    let bigname = name.split('-')[0]
    wx.setNavigationBarTitle({
      title: name//页面标题为路由参数
    })
    let data = {
      engineeringId: id
    }
    app.questUrl("jeecg-boot/air/environmentalmonitoring", 'post', token, data).then(function (res) {
      console.log(res)
      if (res.data.result.length>0) {
        let arr = [], arr1 = [], idarr = [], valuelist = [], rest = res.data.result;
        for (let i = 0; i < res.data.result.length; i++) { arr.push(0); arr1.push(0); idarr.push('lineCanvas' + i) }
        console.log(arr)
        let dat = {
          equipmentId: res.data.result[0].values[0].equipment_id,
          typeId: res.data.result[0].values[0].type_id,
          date: that.getNowFormatDate()
          // date: "2019-05-16"
        }
        that.setData({
          projectlist: res.data.result,
          windowWidth: app.globalData.width,
          height: app.globalData.heightall,
          title: name,
          indexarr: arr,
          navScrollLeftarr1: arr1,
          idarr: idarr,
          date: that.getNowFormatDate(),
          dat: dat,
          bigname:bigname,
          name: rest[0].values[0].typeName,
          item: rest[0].values[0],
          today: that.getNowFormatDate(),
          projectlistshow: res.data.result.length > 0 ? true : false
          
        })
        
          app.questUrl("jeecg-boot/air/dayline", 'post', token, dat).then(function (res) {
            console.log(res)
            for (let i = 0; i < res.data.result.valueList.length; i++) {
              valuelist.push(res.data.result.valueList[i].value)
            }
            // console.log(lineChart)
           
            // that.updateData(valuelist)
            that.updateData(valuelist, that.data.currentTab, that.data.name, that.data.item.unit, res.data.result.max, res.data.result.min)
            // lineChart.opts.yAxis.max = res.data.result.max
            let flg = valuelist.find(m => m != null)
            console.log(flg)
            if (flg) {
              that.setData({
                chartshow: true,
                canvasopacity: true
              })
            } else {
              that.setData({
                chartshow: false,
                canvasopacity: true
              })
            }
            console.log(that.data.chartshow)
          })
      } else {
        that.setData({
          projectlistshow: false
        })
      }
    });
    
  },
 
  //小标题更改曲线变化函数
  switchNav1(event) {
    let cur = event.currentTarget.dataset.current, item = event.currentTarget.dataset.item, token = wx.getStorageSync('token');
    let idx = event.currentTarget.dataset.idx, arr = this.data.indexarr, leftarr = this.data.navScrollLeftarr1, that = this;
    let valuelist = [];
    arr[idx] = cur;
    //每个tab选项宽度占1/5
    let singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中    
    leftarr[idx] = (cur - 2) * singleNavWidth
    let dat = {
      equipmentId: item.equipment_id,
      typeId: item.type_id,
      date: this.data.date
    }
    this.setData({
      indexarr: arr,
      navScrollLeftarr1: leftarr,
      dat: dat,
      name: item.typeName,
      item:item
    })
    app.questUrl("jeecg-boot/air/dayline", 'post', token, dat).then(function (res) {
      console.log(res)
      for (let i = 0; i < res.data.result.valueList.length; i++) {
        valuelist.push(res.data.result.valueList[i].value)
      }
      // lineChart.opts.series[0].data = valuelist
      // that.updateData(valuelist)
      that.updateData(valuelist, that.data.currentTab, that.data.name, that.data.item.unit, res.data.result.max, res.data.result.min)
      // var series = [{
      //   name: item.typeName,
      //   data: valuelist,
      //   format: function (val, name) {
      //     return val;
      //   }
      // }];
      // lineChart.updateData({
      //   series: series
      // });
      // lineChart.opts.yAxis.max=2000
      console.log(valuelist)
      let flg = valuelist.find(m => m != null)
      console.log(flg)
      if (flg) {
        that.setData({
          chartshow: true
        })
      } else {
        that.setData({
          chartshow: false
        })
      }
      console.log(that.data.chartshow)
     
    })
  },
  //大标题更改曲线变化函数（点击nav）
  switchNav(event) {
    console.log('nav')
    var cur = event.currentTarget.dataset.current, projectlist = this.data.projectlist, that = this;
    let token = wx.getStorageSync('token'), index = this.data.indexarr[cur];
    //每个tab选项宽度占1/5
    console.log(cur)
    var singleNavWidth = this.data.windowWidth / 3;
    //tab选项居中                            
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 1) * singleNavWidth
    })
    if (projectlist[cur].values[index]) {
      let dat = {
        equipmentId: projectlist[cur].values[index].equipment_id,
        typeId: projectlist[cur].values[index].type_id,
        date: this.data.date
      }
      if (this.data.currentTab == cur) {
        return false;
      } else {
        this.setData({
          dat: dat,
          name: projectlist[cur].values[index].typeName,
          item: projectlist[cur].values[index]
        })
      }

      app.questUrl("jeecg-boot/air/dayline", 'post', token, dat).then(function (res) {
        console.log(res)
        let valuelist = [];
        for (let i = 0; i < res.data.result.valueList.length; i++) {
          valuelist.push(res.data.result.valueList[i].value)
        }
        console.log(valuelist)
        // lineChart.opts.series[0].data = valuelist
        // that.updateData(valuelist)
        that.updateData(valuelist, that.data.currentTab, that.data.name, that.data.item.unit, res.data.result.max, res.data.result.min)
        let flg = valuelist.find(m => m != null)
        console.log(flg)
        if (flg) {
          that.setData({
            chartshow: true
          })
        } else {
          that.setData({
            chartshow: false
          })
        }
        console.log(that.data.chartshow)
        
      })
    }
  },
  //大标题更改曲线变化函数（左右滑动）
  switchTab(event) {
    var cur = event.detail.current, projectlist = this.data.projectlist, that = this;
    let token = wx.getStorageSync('token'), index = this.data.indexarr[cur];
    var singleNavWidth = this.data.windowWidth / 3;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 1) * singleNavWidth
    })
    if (projectlist[cur].values[index]) {
      let dat = {
        equipmentId: projectlist[cur].values[index].equipment_id,
        typeId: projectlist[cur].values[index].type_id,
        date: this.data.date
      }
      this.setData({

        dat: dat,
        name: projectlist[cur].values[index].typeName,
        item: projectlist[cur].values[index]
      });
      app.questUrl("jeecg-boot/air/dayline", 'post', token, dat).then(function (res) {
        console.log(res)
        let valuelist = [];
        for (let i = 0; i < res.data.result.valueList.length; i++) {
          valuelist.push(res.data.result.valueList[i].value)
        }
        console.log(valuelist)
        // lineChart.opts.series[0].data = valuelist
        // that.updateData(valuelist)
        that.updateData(valuelist, that.data.currentTab, that.data.name, that.data.item.unit, res.data.result.max, res.data.result.min)
        let flg = valuelist.find(m => m != null)
        console.log(flg)
        if (flg) {
          that.setData({
            chartshow: true
          })
        } else {
          that.setData({
            chartshow: false
          })
        }
        console.log(that.data.chartshow)

      })
    }

  },
  //获取当前时间规定格式
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  //chart点击时显示的图表值
  touchHandler: function (e) {
    let idx = e.target.dataset.indx;
    switch (idx) {
      case 0: console.log(111)
        lineChart.showToolTip(e, {
          format: function (item, category) {
            console.log(item)
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 1:
        lineChart1.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 2:
        lineChart2.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 3:
        lineChart3.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 4:
        lineChart.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 5:
        lineChart.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 6:
        lineChart.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 7:
        lineChart.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 8:
        lineChart.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 9:
        lineChart.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
      case 10:
        lineChart.showToolTip(e, {
          format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data
          }
        }); break;
    }
    console.log(lineChart.getCurrentDataIndex(e));
  },
  //每个chart初始
  initchart() {
    //设置canvas宽度
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    // var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas0',
      type: 'line',
      categories: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
      animation: true,
      background: '#f1f3f5',
      series: [{
        name: '',
        data: [],
        format: function (val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '单位',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0,
        max: 10
      },
      width: windowWidth,
      height: 260,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
    lineChart1 = new wxCharts({
      canvasId: 'lineCanvas1',
      type: 'line',
      categories: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
      animation: true,
      background: '#f1f3f5',
      series: [{
        name: '',
        data: [],
        format: function (val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '单位',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0,
        max: 10
      },
      width: windowWidth,
      height: 260,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
    lineChart2 = new wxCharts({
      canvasId: 'lineCanvas2' ,
      type: 'line',
      categories: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
      animation: true,
      background: '#f1f3f5',
      series: [{
        name: '',
        data: [],
        format: function (val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '单位',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0,
        max: 10
      },
      width: windowWidth,
      height: 260,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
    lineChart3 = new wxCharts({
      canvasId: 'lineCanvas3' ,
      type: 'line',
      categories: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
      animation: true,
      background: '#f1f3f5',
      series: [{
        name: '',
        data: [],
        format: function (val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '单位',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0,
        max: 10
      },
      width: windowWidth,
      height: 260,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
    lineChart4 = new wxCharts({
      canvasId: 'lineCanvas4' ,
      type: 'line',
      categories: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
      animation: true,
      background: '#f1f3f5',
      series: [{
        name: '',
        data: [],
        format: function (val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '单位',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0,
        max: 10
      },
      width: windowWidth,
      height: 260,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
    setTimeout(function(){
      lineChart5 = new wxCharts({
        canvasId: 'lineCanvas5',
        type: 'line',
        categories: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        animation: true,
        background: '#f1f3f5',
        series: [{
          name: '',
          data: [],
          format: function (val, name) {
            return val;
          }
        }],
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          title: '单位',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0,
          max: 10
        },
        width: windowWidth,
        height: 260,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        }
      });
      lineChart6 = new wxCharts({
        canvasId: 'lineCanvas6',
        type: 'line',
        categories: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        animation: true,
        background: '#f1f3f5',
        series: [{
          name: '',
          data: [],
          format: function (val, name) {
            return val;
          }
        }],
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          title: '单位',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0,
          max: 10
        },
        width: windowWidth,
        height: 260,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        }
      });
      lineChart7 = new wxCharts({
        canvasId: 'lineCanvas7',
        type: 'line',
        categories: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        animation: true,
        background: '#f1f3f5',
        series: [{
          name: '',
          data: [],
          format: function (val, name) {
            return val;
          }
        }],
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          title: '单位',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0,
          max: 10
        },
        width: windowWidth,
        height: 260,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        }
      });
      lineChart8 = new wxCharts({
        canvasId: 'lineCanvas8',
        type: 'line',
        categories: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        animation: true,
        background: '#f1f3f5',
        series: [{
          name: '',
          data: [],
          format: function (val, name) {
            return val;
          }
        }],
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          title: '单位',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0,
          max: 10
        },
        width: windowWidth,
        height: 260,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        }
      });
      lineChart9 = new wxCharts({
        canvasId: 'lineCanvas9',
        type: 'line',
        categories: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        animation: true,
        background: '#f1f3f5',
        series: [{
          name: '',
          data: [],
          format: function (val, name) {
            return val;
          }
        }],
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          title: '单位',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0,
          max: 10
        },
        width: windowWidth,
        height: 260,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        }
      });
      lineChart10 = new wxCharts({
        canvasId: 'lineCanvas10',
        type: 'line',
        categories: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        animation: true,
        background: '#f1f3f5',
        series: [{
          name: '',
          data: [],
          format: function (val, name) {
            return val;
          }
        }],
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          title: '单位',
          format: function (val) {
            return val.toFixed(2);
          },
          min: 0,
          max: 100
        },
        width: windowWidth,
        height: 260,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        }
      });
    },2000)
    
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