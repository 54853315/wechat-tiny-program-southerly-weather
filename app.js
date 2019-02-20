wx.showShareMenu({
  withShareTicket: true
})

//app.js
App({
  _login: function () {
    console.log("正在前往登录页面")
    wx.reLaunch({
      url: '/pages/login/index'
    })
  },
  _getUserInfo: function () {
    // console.log("_getUserInfo()")
    let that = this;
    wx.login({
      success: res => {
        wx.request({
          url: that.globalData.apiUrl + "/weixin/get_open_id",
          data: {
            from: "_getUserInfo",
            code: res.code
          },
          success: function (r) {
            if (r.data.data.openid) {
              that.globalData.open_id = r.data.data.openid;
              that.globalData.session_key = r.data.data.session_key;
            }
          },
          fail: function (res) {
            wx.hideLoading();
            wx.showModal({
              showCancel: false,
              title: 'get_openid错误',
              content: res.errMsg
            })
          },
          complete: function () {
            wx.hideLoading();
          }
        });
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          title: '微信login错误',
          content: res.errMsg
        })
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  _get: function (url, data, success, error, showloading) {

    console.log("[get]请求"+url);
    
    if (showloading) {
      wx.showLoading();
    }

    if (!this.globalData.open_id || this.globalData.open_id == '') {
      this._getUserInfo();
    }

    if (!this.globalData.open_id || this.globalData.open_id == '') {
      wx.showModal({
        content: '很抱歉，无法获取open_id……',
        showCancel: false
      })
      return false;
    }

    console.error("get--------------" + this.globalData.open_id); //null

    console.log("正在请求" + this.globalData.apiUrl + url + "，参数为", data)

    wx.request({
      url: this.globalData.apiUrl + url,
      data: data,
      success: function (res) {
        if (res.statusCode == 200) {
          success && success(res.data);
          return false;
        }
        if (res.statusCode == 404) {
          return false;
        }
        if (res.statusCode !== 0) {
          wx.showModal({
            showCancel: false,
            content: res.errMsg
          })
          return false;
        }
      },
      fail: function (res) {
        console.log('in fail' + res.errMsg)
        wx.showModal({
          showCancel: false,
          content: "网络异常，请重试"
        })
        error && error(res);
      },
      complete: function () {
        if (showloading) {
          wx.hideLoading();
        }
      }
    });
  },
  _post: function (url, data, success, error) {

    wx.showLoading();
    if (!this.globalData.open_id || this.globalData.open_id == '') {
      this._getUserInfo();
    }


    wx.request({
      url: this.globalData.apiUrl + url,
      data: data,
      method: "POST",
      success: function (res) {
        if (res.statusCode == 200) {
          success && success(res.data);
          return false;
        }
        if (res.statusCode !== 0) {
          wx.showModal({
            showCancel: false,
            content: res.data.info
          })
          return false;
        }
        success && success(res);
      },
      fail: function (res) {
        error && error(res);
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  onLaunch: function () {
    wx.showLoading();
    console.log("---------onLaunch开始执行---------")
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    if (wx.getStorageSync('open_id') != "") {
      this.globalData.open_id = wx.getStorageSync('open_id')
    }


    this._getUserInfo();
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              this.globalData.encryptedData = res.encryptedData;
              this.globalData.iv = res.iv;

              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          this._login()
        }
      }
    })
  },
  globalData: {
    apiUrl: "https://weather.crazyphper.com/api",
    // apiUrl: "http://127.0.0.1:8000/api",
    userInfo: null,
    open_id: null,
    session_key: null,
    unionId: null,
    encryptedData: null,
    iv: null,
    binding: false,
    defaultListImg: '../../common/assets/icons/haoyunbuzai.jpeg',
    netStatus: true,
  },

})
