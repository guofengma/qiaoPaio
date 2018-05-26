import cyurl from "../../utils/url";
// pages/couponDetail/couponDetail.js
import getData from "../../utils/getData.js"
let openId = wx.getStorageSync('openId')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareMbId:"",
    endTime: '',
    seqId: '',
    startTime: '',
    storeAddr: '',
    storeId: '',
    storeImg: '',
    storeName: '',
    storePhone: '',
    ticketCode: '',
    ticketDetail: '',
    ticketImg: '',
    ticketLimit: '',
    ticketMoney: '',
    ticketName: '',
    ticketNum: '',
    ticketNumGet: '',
    ticketTxt: '',
    ticketType: '',
    availDate: '',
    availNum: '',
    availTime: '',
    code: '',
    seqId:''
  },

   onShareAppMessage: function (res) {
     console.log("转发啊")
    let that = this;
    let shareMbId = wx.getStorageSync("mbId");
    let seqId = that.data.seqId;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '优惠券详情',
      // path: '/page/couponDetail/couponDetail?from=share&shareMbId=' + shareMbId + '&seqId=' + seqId,
      path: '/pages/couponDetail/couponDetail?from=share&shareMbId='+shareMbId+'&seqId='+seqId,
      success: function(res) {
        // 转发成功
        console.log("转发成功")
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败")
      }
    }
  },

  //获取当前页面完整路径(含参数)，用于登录后跳回
  getCurrentPageUrl:function(e){
    var currentPageUrl = "";

    var pages = getCurrentPages()    //获取加载的页面

    var currentPage = pages[pages.length-1]    //获取当前页面的对象

    var url = currentPage.route    //当前页面url

    var options = currentPage.options    //如果要获取url中所带的参数可以查看options

    var cs = "";

    if(Object.keys(options).length){
      for(var i in options){
        cs+= i+"="+options[i]+"&"
      }
      cs = cs.substr(0,cs.length-1);
    }
    currentPageUrl = '/'+url+'?'+cs;
    console.log("currentPageUrl -->",currentPageUrl);
    // this.setData({
    //   currentPageUrl:currentPageUrl
    // })
    // return currentPageUrl
    wx.setStorageSync("currentPageUrl",currentPageUrl);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let list = ['endTime', 'seqId', 'startTime', 'storeAddr', 'storeId', 'storeImg', 'storeName', 'storePhone', 'ticketCode', 'ticketDetail', 'ticketImg', 'ticketLimit', 'ticketMoney', 'ticketName', 'ticketNum', 'ticketNumGet', 'ticketTxt', 'ticketType', 'availDate', 'availNum', 'code', 'availTime']
    console.log("优惠券详情 options -->",options);
    let salseIsLogin = wx.getStorageSync("salseIsLogin");
    this.getCurrentPageUrl();
    console.log("salseIsLogin -->", salseIsLogin);
    if(!salseIsLogin){
      wx.redirectTo({
        url:"/pages/login/login?needback=true&backIsMenu=false"
      })
    }
    this.setData({
      seqId: options.seqId
    })
    if (options.shareMbId){
      this.setData({
        shareMbId: options.shareMbId
      })
      this.shareSales();
    }
    getData.getaxios(this, {                     //this 一定要写
      url: 'ticketDetail',      //请求的URL      //类型字符串    //必填
      data: {
        seqId: this.data.seqId
      },                      //前后台传的参数       //类型对象
      sourceData: list, //需要的数据源里面渲染请求回来的数据名称 //类型数组里面字符串
      updateData: list,  //需要在请求回来的数据里面提取的数据名称    //类型数组里面字符串
      callback: '',   //成功的回调                 //类型函数
      requestType: "GET"    //请求类型（默认GET）        //类型字符串
    });
    console.log("优惠券详情 options -->",options)
  },

  receive(e) {
    let that = this;
    let openId = wx.getStorageSync('openId')
    let seqId = that.data.seqId
    console.log(seqId)

    getData.getaxios(this, {                     //this 一定要写
      url: 'getTicket',      //请求的URL      //类型字符串    //必填
      data: {
        openId: openId,
        seqId: seqId
      },                      //前后台传的参数       //类型对象
      sourceData: [], //需要的数据源里面渲染请求回来的数据名称 //类型数组里面字符串
      updateData: [],  //需要在请求回来的数据里面提取的数据名称    //类型数组里面字符串
      callback: that.hint,   //成功的回调                 //类型函数
      // requestType: "GET"    //请求类型（默认GET）        //类型字符串
    })
  },

  hint: function () {
    wx.showToast({
      title: '领取成功',
    })
  },

  //建立上下级关系
  shareSales:function(e){
    let that = this;
    let openId = wx.getStorageSync("openId");
    let mbId = that.data.shareMbId;
    if (!mbId){
      console.log("分享者不存在")
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: cyurl.shareSales,
      header: {
        'content-type': 'application/json'
      },
      data:{
        openId: openId,
        mbId: mbId
      },
      success: function (res) {
        console.log("建立上下级关系 res -->", res)
        if (res.data.code == 0) {
          console.log("建立上下级关系 成功 ！！！")
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: res.data.msg,
          })
        }
      },
      fail: function (res) {
        console.log("建立上下级关系 Err-->", res)
      },
      complete: function (res) {
        wx.hideLoading()
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