//app.js
import cyurl from "/utils/url";
import cyutil from 'utils/util.js'
App({
  onLaunch: function () {
    console.log('App onLaunch');
    //获取openId
    cyutil.getOpenId();
  },

  globalData: {
    userInfo: null,
    wxOpenId: '',
  },

  //提交用户信息
  getMember: function (e) {
    var that = this;
    console.log(that.wxOpenId);
    console.log(that.globalData.userInfo.avatarUrl);
    console.log(that.globalData.userInfo.nickName);
    console.log(that.globalData.userInfo.gender);
    wx.request({
      url: cyurl.saveMember,
      method: 'POST',
      data: {
        openId: wx.getStorageSync("openId"),//openId缓存到本地
        wxImg: that.globalData.userInfo.avatarUrl,
        mbName: that.globalData.userInfo.nickName,
        mbSex: that.globalData.userInfo.gender
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('openId', res)
      },
      fail: function (rej) {
        console.log('openId', rej)
      },
      complete: function (com) {
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData && this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
          that.getMember()
        }
      })
    }
  }

})