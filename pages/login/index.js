const app = getApp()

Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad() {},
    bindGetUserInfo(e) {
        wx.login({
            success(res) {
                console.log('wx.login', res)
                if (res.code) {
                    //请求服务器保存用户信息
                    app._get('/weixin/get_open_id?code=' + res.code, {}, function(res2) {
                        if (res2.status == 100) {
                            wx.showModal({
                                content: res2.info,
                                showCancel: false
                            })
                            return false;
                        }
                        try {
                            wx.setStorageSync('open_id', res2.data.openid)
                            wx.setStorageSync('session_key', res2.data.session_key)
                        } catch (e) {}

                        app.globalData.session_key = res2.data.session_key
                        app.globalData.open_id = res2.data.openid

                        wx.getUserInfo({
                            success(res) {
                                app.globalData.encryptedData = res.encryptedData
                                app.globalData.iv = res.iv
                                app._post('/user', {
                                    encryptedData: res.encryptedData,
                                    sessionKey: wx.getStorageSync('session_key'),
                                    open_id: wx.getStorageSync('open_id'),
                                    iv: res.iv,
                                }, function(res2) {
                                    if (res2.status == 100) {
                                        wx.showModal({
                                            content: res2.info,
                                            showCancel: false
                                        })
                                    } else {
                                        wx.showToast({
                                            title: '"Ho!Ho!Ho!(圣诞老人音)..."',
                                            icon: 'none',
                                            duration: 2500,
                                            success: (res) => {
                                                let timer = setTimeout(() => {
                                                    clearTimeout(timer)
                                                    wx.reLaunch({
                                                        url: '/pages/index/index'
                                                    })
                                                }, 2500)
                                            },
                                        })
                                    }
                                })
                            }
                        })
                    })
                } else {
                    console.log('wx.login 失败！' + res.errMsg)
                }
            }
        })
    }
})
