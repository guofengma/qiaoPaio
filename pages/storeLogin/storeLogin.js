import cyurl from "../../utils/url";
// pages/storeLogin/storeLogin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proAccount:"",
    proPwd:"",
  },

  //保存输入
  saveInput:function(e){
    let that = this;
    let value = e.detail.value;
    let name = e.currentTarget.dataset.name;
    let obj = {
      [name]:value
    };
    console.log(name+'的值为：',value);
    console.log("obj",obj);
    that.setData(obj)
  },

  //门店登录
  storeLogin:function(e){
    let that = this;
    let proAccount = that.data.proAccount;
    let proPwd = that.data.proPwd;
    let mbId = wx.getStorageSync("mbId");
    if (proAccount.trim() == '' || proAccount == undefined || proPwd.trim() == '' || proPwd == undefined){
      wx.showToast({
        image: "/images/hint.png",
        title: '账号或密码为空',
      })
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: cyurl.storeLogin,
      header: {
        'content-type': 'application/json'
      },
      data:{
        mngAccount: proAccount,
        mngPwd: proPwd,
        mbId: mbId
      },
      success: function (res) {
        console.log("门店登录 res -->", res)
        if (res.data.code == 0) {
          let StoreId = res.data.seqId;
          wx.setStorageSync("storeIsLogin", 1);
          wx.setStorageSync("StoreId", StoreId);
          wx.setStorageSync("storePhone", proAccount);
          wx.navigateTo({
            url: '/pages/chooseDestroyCate/chooseDestroyCate',
          })
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: res.data.msg,
          })
        }
      },
      fail: function (res) {
        console.log("门店登录 Err-->", res)
      },
     complete: function (res) {
        setTimeout(function(){          
          wx.hideLoading()
        },2000)
      }
    })
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

})