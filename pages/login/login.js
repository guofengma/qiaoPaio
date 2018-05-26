import cyurl from "../../utils/url";
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proAccount:"",
    proPwd:"",
  },

  //保存输入
  saveInput: function (e) {
    let that = this;
    let value = e.detail.value;
    let name = e.currentTarget.dataset.name;
    let obj = {
      [name]: value
    };
    console.log(name + '的值为：', value);
    console.log("obj", obj);
    that.setData(obj)
  },

  toIndex:function(e){
    console.log('1')
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  //销售员登录
  salesLogin:function(e){
    let that = this;
    let proAccount = that.data.proAccount;
    let proPwd = that.data.proPwd;
    let openId = wx.getStorageSync("openId");
    if (proAccount.trim() == '' || proAccount == undefined || proPwd.trim() == '' || proPwd == undefined) {
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
      url: cyurl.salesLogin,
      header: {
        'content-type': 'application/json'
      },
      data: {
        linkerPhone: proAccount,
        manPwd: proPwd,
        openId: openId
      },
      success: function (res) {
        console.log("销售员登录 res -->", res)
        if (res.data.code == 0) {
          wx.setStorageSync("salseIsLogin", 1);
          let pages = getCurrentPages();
          let needback = that.data.needback;
          let currentPageUrl = wx.getStorageSync("currentPageUrl");
          let backIsMenu = that.data.backIsMenu;
          if(needback){
            if(backIsMenu == "true"){
              wx.switchTab({
                 url: '/pages/index/index',
              })
            }else{
              wx.redirectTo({
                url:currentPageUrl
              })
            }
          }else{
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: res.data.msg,
          })
        }
      },
      fail: function (res) {
        console.log("销售员登录 Err-->", res)
      },
      complete: function (res) {
        setTimeout(function(){          
          wx.hideLoading()
        },2000)
      }
    })
  },

  //跳转注册
  toRegister:function(){
    let that = this;
    let needback = that.data.needback;
    let backIsMenu = that.data.backIsMenu;
    if(needback){
      wx.navigateTo({
        url: '/pages/register/register?needback=true&backIsMenu='+backIsMenu,
      })
    }else{
      wx.navigateTo({
        url: '/pages/register/register',
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("登录页面 login options -->",options);
    let needback = options.needback;
    let backIsMenu = options.backIsMenu;
    if(needback){
      this.setData({
        needback:needback,
        backIsMenu:backIsMenu
      })
    }
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
    let that = this;
    let salseIsLogin = wx.getStorageSync("salseIsLogin")
    console.log("salseIsLogin: -->", salseIsLogin);
    if (salseIsLogin == 1){
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
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