import cyurl from "../../utils/url";
import cyutil from "../../utils/util";
import getData from "../../utils/getData.js"
var app = getApp();
// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: "",
      nickName: ""
    },
    // 获取会员信息(积分) 接口返回
    bean:{
      mbintegral:"",  //积分
      mbIdentity:"",  //身份
      seqId: "", //会员编号
    },
    toDay:"",
    isSign:0,
  },

  // 退出登录
  logout:function(e){
    wx.setStorageSync("salseIsLogin", 0)
    wx.reLaunch({
      url: '/pages/login/login',
    })
  },

  //签到  
  //点击签到 ——>去读缓存qianDaoDate == 今天？已签到，跳转 :签到 签到成功  --缓存写入  qianDaoDate == 今天 跳转
  //
  qianDao:function(){
    let that = this;
    let mbId = wx.getStorageSync("mbId");
    let openId = wx.getStorageSync("openId");
    let qianDaoDate = wx.getStorageSync("qianDaoDate");  //签到状态
    let toDay = that.data.toDay;
    let isSign = that.data.isSign;

    if (isSign == 1){
      wx.navigateTo({
        url: '/pages/calendar/calendar?myId=' + that.data.bean.seqId,
      })
      return
    }
    wx.showLoading({
      title: '加载中',
      mask:true,
    })
    wx.request({
      url: cyurl.sign,
      header: {
        'content-type': 'application/json'
      },
      data:{
        mbId: mbId,
        openId: openId
      },
      success: function (res) {
        wx.hideLoading();
        that.setData({
          isSign:1
        })
        wx.setStorageSync('qianDaoDate', toDay)
        console.log("签到 res -->", res)
        if (res.data.code == 0) {
          wx.showToast({
            title: '签到成功',
          })
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title:res.data.msg,
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          image: "/images/hint.png",
          title: res.data.msg,
        })
        console.log("签到 Err-->", res)
      },
      complete: function (res) {
        wx.navigateTo({
          url: '/pages/calendar/calendar?myId=' + that.data.bean.seqId,
        })
      }
    })
  },
  to(){
    wx.navigateTo({
      url: '/pages/calendar/calendar',
    })
  },
  //跳转 门店登录(判断门店是否登录和是否已经退出登录)
  // 已登录 跳转 核销页面 
  // 未登录 跳转登录页
  //登录成功时 写入缓存一个门店登录状态 ，登录判断时 用 storeIsLogin 1:已登录 0/其他值 未登录
  toStoreLogin:function(){
    let storeIsLogin = wx.getStorageSync("storeIsLogin");
    if (storeIsLogin == 1){
      wx.navigateTo({
        url: '/pages/chooseDestroyCate/chooseDestroyCate',
      })
    }else{
      wx.navigateTo({
        url: '/pages/storeLogin/storeLogin',
      })
    }
  },


  //获取会员信息(积分)
  getUserJfInfo:function(){
    let that = this;
    let openId = wx.getStorageSync("openId");
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: cyurl.getUserInfo,
      header: {
        'content-type': 'application/json'
      },
      data:{
        openId: openId
      },
      success: function (res) {
        wx.hideLoading()
        console.log("获取会员信息(积分) res -->", res)
        if (res.data.code == 0) {
          let bean = res.data.bean;
          that.setData({
            bean: bean
          })
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: res.data.msg,
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()        
        wx.showToast({
          image: "/images/hint.png",
          title: '获取失败',
        })
        console.log("获取会员信息(积分) Err-->", res)
      }
    })
  },

  //跳转链接
  toLink:function(e){
    let taht = this;
    let link = e.currentTarget.dataset.link;
    if(link){
      wx.navigateTo({
        url: link + '?myId=' + this.data.bean.seqId,
      })
    }
  },

  //我的下载
  toDown:function(){
    wx.navigateTo({
      url: '/pages/download/download',
    })
  },

  //扫码
  saoMa:function(){
    let that = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        console.log("扫码 res -->",res)
        let qrcode = res.result;
        that.qrcodeInfo(qrcode);
      },
      fail:(res) => {
        wx.showToast({
          image:"/images/hint.png",
          title:"扫码失败"
        })
      }
    })
  },

  //扫码积分
  qrcodeInfo: function (qrcode){
    let that = this;
    let mbId = wx.getStorageSync("mbId");
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: cyurl.qrcodeInfo,
      header: {
        'content-type': 'application/json'
      },
      data: {
        busiType: "code",
        qrcode: qrcode,
        mbId: mbId
      },
      success: function (res) {
        console.log("扫码积分 -->", res)
        if (res.data.code == 0) {
          wx.showToast({
            title: res.data.msg,
          })
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: res.data.msg,
          })
        }
      },
      fail: function (res) {
        console.log("扫码积分 Err-->", res)
      },
      complete: function (res) {
        setTimeout(function(){          
          wx.hideLoading()
        },2000)
      }
    })
  },

  //设置 toDay 字符串为今天
  setToDay:function(){
    let that = this;
    let toDay = that.getData();
    that.setData({
      toDay:toDay
    })
  },

  // 获取 今天的 时间 yyyy/mm/dd 格式
  getData:function(){
    let that = this;
    let toDay = cyutil.formatDate(new Date());
    console.log("toDay",toDay)
    return toDay;
  },

  //提示暂无数据
  toHint: function () {
    wx.showToast({
      image: "/images/hint.png",
      title: '暂无数据'
    })
  },

  //判断是否签到
  isSign:function(){
    let that = this;
    let qianDaoDate = wx.getStorageSync("qianDaoDate");  //签到状态
    let toDay = that.data.toDay; 
    if(toDay == qianDaoDate){
      that.setData({
        isSign:1
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    that.getUserJfInfo();
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

    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    });

    // that.getUserJfInfo();
    // 设置Today 为今天
    that.setToDay();

    //判断是否签到
    that.isSign()
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