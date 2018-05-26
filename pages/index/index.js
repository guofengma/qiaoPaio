import cyurl from "../../utils/url";
import cyutil from "../../utils/util";

var WxParse = require('../wxParse/wxParse.js');

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword:"", //搜索词
    slideImgs:[
      {
        imgUrl:"/images/old/lb.png"
      },
      {
        imgUrl: "/images/old/lb.png"
      }
    ],
    list:[
      {a:1}
    ],
    brandList:[], //品牌专区
    productList:[], //产品证言
    techList:[],  //技术领先
    leaderList:[],  //行业大咖
  },

  // html标签解析
  parse:function(arr,name){
    let that = this;
    // let gameDetail = that.data.bean.gameDetail;
    // WxParse.wxParse('gameDetails', 'html', gameDetail, that, 5);

    for (let i = 0; i < arr.length; i++) {
      WxParse.wxParse(name + i, 'html', arr[i].infoContentStr, that);
      if (i === arr.length - 1) {
        WxParse.wxParseTemArray(name+"Arr",name, arr.length, that)
      }
    }

  },

  // 轮播图跳转
  toLink: function (e) {
    var seqId = e.currentTarget.dataset.seqId;
    var link = e.currentTarget.dataset.link;
    if (link) {
      wx.navigateTo({
        url: link,
      })
    }
  },

  //点击分类跳转信息列表页
  toCateInfoList:function(e){
    let that = this;
    let busiType = e.currentTarget.dataset.busitype;
    wx.navigateTo({
      url: '/pages/infoList/infoList?busiType=' + busiType,
    })
  },

  //获取轮播图
  getSwiper: function () {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: cyurl.imgUrl,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        console.log("轮播图 res -->", res)
        if (res.data.code == 0) {
          var slideImgs = res.data.slideImgs;
          that.setData({
            slideImgs: slideImgs
          })
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: res.data.msg,
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          image: "/images/hint.png",
          title: "获取失败",
        })
        console.log("轮播图 Err-->", res)
      },
      complete:function(res){
        // wx.hideLoading()
      }
    })
  },

  //2.获取推荐的信息分类列表
  //busiType brand --品牌专区
  //busiType testimony --产品证言
  //busiType tech --技术领先
  //busiType leader --行业大咖
  getInfoList: function (busiType,cname){
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: cyurl.infoRecList,
      header: {
        'content-type': 'application/json'
      },
      data:{
        busiType: busiType
      },
      success: function (res) {
        wx.hideLoading()
        console.log("获取推荐的信息分类列表 "+cname+"-->", res)
        if (res.data.code == 0) {
          var list = res.data.list;
          that.setData({
            [busiType+'List']: list
          })
          if (list.length) {
            that.parse(list, busiType);
          }
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: '获取失败',
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          image: "/images/hint.png",
          title: '获取失败',
        })
        console.log("获取推荐的信息分类列表 Err-->", res)
      },
      complete: function (res) {
        // wx.hideLoading()
      }
    })
  },

  //跳转文章详情
  toDetail:function(e){
    let that = this;
    let seqId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:"/pages/infoDetail/infoDetail?busiType=content&seqId="+seqId
    })
  },

  //保存搜索框中的输入
  saveInput: function (e) {
    console.log(e.detail);
    //  console.log(JSON.stringify(e.detail));    
    this.setData({
      keyword: e.detail.value
    })
  },

  //搜索(点击键盘完成按钮 触发)
  bindSearch: function (event) {
    let that = this;
    let keyword = that.data.keyword;//event.detail.value;

    if (keyword == undefined || keyword.trim() == "") {
      wx.showToast({
        image:"/images/hint.png",
        title: '关键字不能为空',
      })
    } else {
      wx.navigateTo({
        url: '/pages/infoList/infoList?&keyword=' + keyword,
      })
    }
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
        wx.hideLoading()
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
        wx.hideLoading()
        console.log("建立上下级关系 Err-->", res)
      },
      complete: function (res) {
        // wx.hideLoading()
      }
    })
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
    let that = this;    
    console.log("index 页面 options -->",options);
    let salseIsLogin = wx.getStorageSync("salseIsLogin");
    // let currentPageUrl = this.getCurrentPageUrl();
    this.getCurrentPageUrl();
    console.log("salseIsLogin -->", salseIsLogin);
    console.log("shareMbId:", options.shareMbId);

    //跳转前，缓存邀请者编号 0430-Tony
    if (options.shareMbId) {
      wx.setStorageSync('shareMbId', options.shareMbId);
      this.setData({
        shareMbId: options.shareMbId
      })
      this.shareSales();
    }
    if(!salseIsLogin){
      wx.redirectTo({
        url:"/pages/login/login?needback=true&backIsMenu=true"
      })
    }
    
    that.getSwiper();
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
    that.getInfoList("brand", "品牌专区");
    that.getInfoList("testimony", "产品证言");
    that.getInfoList("tech", "技术领先");
    that.getInfoList("leader", "行业大咖");
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
      title: '',
      // path: '/page/couponDetail/couponDetail?from=share&shareMbId=' + shareMbId + '&seqId=' + seqId,
      path: '/pages/index/index?from=share&shareMbId='+shareMbId,
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
})