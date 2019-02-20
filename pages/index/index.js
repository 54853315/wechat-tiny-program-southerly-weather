const app = getApp()
const QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
var qqmapsdk;

wx.showShareMenu({
  withShareTicket: true
})

export default Page({
  data: {
    style: 'border-radius: 66rpx;height:70rpx;line-height:60rpx;',
    region: ['广东省', '广州市', '海珠区'],
    regionLock: false,
    customItem: "全部",
    hours: [],
    items: [{
      value: '南',
      title: '南风天预警',
      desc: '至少提前6小时提醒'
    }],
    expire_date: "",
    orderText: "立即订阅",
    hour: 8,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  config: {
    usingComponents: {
      "wxc-input": "wxc-input",
      "wxc-list": "wxc-list",
      "wxc-panel": "wxc-panel",
      "wxc-select": "wxc-select",
      "wxc-button": "wxc-button",
      "wxc-icon": "wxc-icon",
      "wxc-counter": "@minui/wxc-counter"
    }
  },
  methods: {

  },
  bindToPayment() {
    wx.showModal({
      showCancel: false,
      content: "抱歉，小宝贝，这个功能还在开发，  你很心急嘛 💅🏻 "
    })
    return false;
    wx.navigateTo({
      url: 'payment'
    })
  },
  setWind(e) {
    var x = e.detail.value
  },
  formSubmit(e) {
    let formId = e.detail.formId
    // console.log("formId", formId)
    let that = this
    wx.showModal({
      title: "请确认您的操作",
      content: "一经确认，立刻骚扰。",
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          return that.sendSubscrire(formId)
        }
      }
    })
    console.log("submit")
  },
  cancelSubscrire() {
    var that = this;
    app._get('/subscription/cancel', {
      open_id: app.globalData.open_id,
    },
      function (r) {
        that.setData({
          orderText: "重新订阅",
        })

        wx.showModal({
          showCancel: false,
          content: "抱歉，我的小程序没有满足你 💅🏻 ——成功退订"
        })

      }, '', true)

  },
  sendSubscrire(formId) {

    var that = this;
    app._post('/subscription', {
      locations: that.data.region,
      reminder_hour: that.data.hour,
      open_id: app.globalData.open_id,
      form_id: formId,
      wind_direction: '南',
      reminder: 'tomorrow',
    },
      function (r) {
        if (r == "") {
          return false;
        }
        if (r.status == 110) {
          wx.showModal({
            content: "预约失败，您的体验时间已过，请先续费",
            showCancel: false
          })
        }
        //显示预约过期时间，并且立刻订阅按钮改为修改预约
        that.setData({
          expire_date: r.data.expire_date,
          orderText: "更新订阅",
        })

        wx.showModal({
          content: "订阅成功！",
          showCancel: false
        })

      }, '', true)
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  bindHourChange: function (e) {
    this.setData({
      hour: this.data.hours[e.detail.value]['id']
    })
  },
  onLoad: function () {
    this.onLoadCall();
  },
  onLoadCall() {
    console.log("我是Index的onLoadCall()")
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'P35BZ-I2CWU-KPXVV-BTEEE-CNSY2-UVFGK'
    });
    this.initHours();
    this.getLocation();
    // console.error("在调用/user之前的onLoadCall() belongsTo OnLoad()，的app.globalData.open_id is :",app.globalData.open_id);
    this.getOrderInfo();
  },
  getOrderInfo: function () {
    let that = this;
    app._get('/user', {
      open_id: app.globalData.open_id
    }, function (res) {
      console.log("/user返回的数据", res)
      if (typeof (res.data.subscribe) !="undefined") {
        if (res.data.subscribe.status == 0) {
          var orderText = "重新订阅";
        } else {
          var orderText = that.data.orderText
        }
        that.setData({
          orderText: orderText,
          region: res.data.subscribe.locations,
        });
      }
      if (res.data.user.vip_expired_at != null) {
        that.setData({
          expire_date: res.data.user.vip_expired_at,
          orderText: "更新订阅"
        });
      }
    });
  },
  //初始化小时
  initHours() {
    let hours = [];
    for (var i = 9; i < 23; i++) {
      var hour = {
        id: i,
        name: "每天" + i + "点"
      };
      hours.push(hour);
    }
    this.setData({
      hours: hours
    })
  },
  getLocation() {

    let that = this;

    //获取用户授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              console.log("请求用户授权位置", res)
              that.setTheCurrentLocation()
            },
            fail() {
              that.locationAuthorizationFailed(res)
            }
          })
        } else {
          that.setTheCurrentLocation()
        }
      }
    })
  },
  locationAuthorizationFailed(res) {
    let that = this
    console.log("locationAuthorizationFailed", res)
    // 拒绝授权地理位置权限
    if (!res.authSetting['scope.userLocation']) {
      wx.showModal({
        // content:"若不授权微信获取位置信息，则无法自动获取您的位置。后期还使用小程序，需在微信【发现】——【小程序】——删除掉【南风天来了】，重新搜索，然后授权，方可使用。",
        content: "您还没有授权我获取您的位置信息呢，要不要去授权下？",
        title: '惺惺相惜的提示下',
        success: (res) => {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.openSetting({
              success: (res) => {
                console.log(res)
                if (res.authSetting['scope.userLocation']) {
                  that.setTheCurrentLocation()
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
      })
    } else {
      wx.showToast({
        title: '网络不给力，请稍后再试',
        icon: 'none',
      })
    }
  },
  setTheCurrentLocation: function () {
    wx.showLoading();
    console.log("in setTheCurrentLocation()")
    let that = this
    //根据用户的地理位置，更改当前所选区域
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        // console.log(res)
        //请求腾讯位置服务接口
        that.getLocal(res.latitude, res.longitude)
      }
    })
    wx.hideLoading();
  },
  // 获取当前地理位置
  getLocal: function (latitude, longitude) {
    let that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        // console.log(JSON.stringify(res));
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        let district = res.result.ad_info.district
        console.log(province + city + district)

        var region = [province, city, district];
        that.setData({
          region: region,
          regionLock: true
        })

      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          content: "因腾讯位置服务接口出现异常，无法自动获取位置，请手动修改您的位置",
          showCancel: false
        })
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  onShareAppMessage: function (ops) {
    console.log('进入了分享哟！')
    return {
      title: '南风天来了',
      path: 'pages/index/index',
      success: function (res) {
        console.log(res)
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
        result = wx.getShareInfo(res.shareTicket)
        console.log(result)
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
});
