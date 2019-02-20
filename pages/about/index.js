// pages/newindex/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList: [
      {
        time: "2019-2-12",
        content: "服务器端程序API准备 \n Table Migrate、DB Seed 跑测试。\n 制作定时获取天气、定时推送的Command脚本（由于和风认证申请还未审核完，暂时开发了意淫版）。",
      },
      {
        time: "2019-2-13",
        content: "因和风认证审核通过，完善Command脚本。\n 完成服务器端API。 \n 完成小程序订阅提醒页面布局。",
      },
      {
        time: "2019-2-14",
        content: "实现登录界面和授权 \n 实现位置授权和补救位置授权\n 腾讯位置服务API，根据wx.getLocation()API 返回的坐标获取位置中文 \n 部署线上服务器",
      },
      {
        time: "2019-2-15",
        content: "处理登录界面的授权处理。（onLanuch和onLoad异步问题）\n 实现订阅接口请求和交互。 \n 显示订阅剩余有效期。"
      },
      {
        time: "2019-2-16",
        content: "优化界面，增强小程序性能。",
      },
      {
        time: "2019-2-17",
        content: "检验计划任务脚本正确执行性，修复问题。\n 实现小程序模板消息推送，发现formId只能用1次且7天后失效的这个限制，我可以改用短信通知，可这不是我最初‘只在小程序里通知用户’的核心玩法，固，放弃，开源供大家学习。",
      },
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

// 格式化订单
var formatNews = function (news) {
  return news.map(item => {
    var time = moment(item.postTime);
    var zero = moment().format('YYYY-MM-DD');
    var after = moment(time).isAfter(zero);
    if (after) {
      item.time = moment(item.postTime).format('HH:mm');
    } else {
      item.time = moment(item.postTime).format('YYYY-MM-DD HH:mm');
    }
    return item;
  });
}

module.exports = {
  formatNews
}
