import cyurl from "../../utils/url";
import cyutil from "../../utils/util";

var WxParse = require('../wxParse/wxParse.js');

// pages/infoList/infoList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    busiType:"",  //其他页面传过来的分类
    keyword:"", //传入的搜索词
    list:[
      {a:"1"}
      ]
  },

  // html标签解析
  parse: function (arr, name) {
    let that = this;
    // let gameDetail = that.data.bean.gameDetail;
    // WxParse.wxParse('gameDetails', 'html', gameDetail, that, 5);

    for (let i = 0; i < arr.length; i++) {
      WxParse.wxParse(name + i, 'html', arr[i].infoContentStr, that);
      if (i === arr.length - 1) {
        WxParse.wxParseTemArray(name+"Arr", name, arr.length, that)
      }
    }

  },

  //根据搜索词获取列表
  getSeacrchList:function(e){
    let that = this;
    let keyword = that.data.keyword;
    let busiType = that.data.busiType;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: cyurl.search,
      header: {
        'content-type': 'application/json'
      },
      data:{
        keyword: keyword
      },
      success: function (res) {
        console.log("根据搜索词获取列表 res -->", res)
        if (res.data.code == 0) {
          var list = res.data.list;
          that.setData({
            list: list
          })
          if (list.length) {
            that.parse(list, "list");
          }
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: '获取失败',
          })
        }
      },
      fail: function (res) {
        console.log("根据搜索词获取列表 Err-->", res)
      },
      complete: function (res) {
        wx.hideLoading()
      }
    })
  },

  //根据分类 busiType 获取信息列表
  getCateList:function(e){
    let that = this;
    let busiType = that.data.busiType;
    let openId = wx.getStorageSync("openId");
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: cyurl.getInfoList,
      header: {
        'content-type': 'application/json'
      },
      data: {
        busiType: busiType,
        openId: openId
      },
      success: function (res) {
        console.log("根据分类 busiType 获取信息列表 res -->", res)
        if (res.data.code == 0) {
          var list = res.data.list;
          that.setData({
            list: list
          })
          if (list.length) {
            that.parse(list, "list");
          }
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: '获取失败',
          })
        }
      },
      fail: function (res) {
        console.log("根据分类 busiType 获取信息列表 Err-->", res)
      },
      complete: function (res) {
        wx.hideLoading()
      }
    })
  },

  //根据options.busiType设置页面title
  setTitle:function(e){
    let that = this;
    let busiType = that.data.busiType;
    if(busiType == 'brand'){
      wx.setNavigationBarTitle({
        title: '品牌专区'
      })
    } else if (busiType == 'testimony'){
      wx.setNavigationBarTitle({
        title: '产品证言'
      })
    }else if(busiType == 'tech'){
      wx.setNavigationBarTitle({
        title: '技术领先'
      })
    }else if(busiType == 'leader'){
      wx.setNavigationBarTitle({
        title: '行业大咖'
      })
    }
  },

  //跳转文章详情
  toDetail:function(e){
    let that = this;
    let seqId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:"/pages/infoDetail/infoDetail?busiType=content&seqId="+seqId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log("信息列表页infoList options -->",options);
    let busiType = options.busiType;
    let keyword = options.keyword;
    that.setData({
      busiType: busiType,
      keyword: keyword
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
    let that = this;
    let busiType = that.data.busiType;
    let keyword = that.data.keyword;
    if (busiType){
      that.getCateList();
      that.setTitle();  //设置标题
    } else if (keyword){
      that.getSeacrchList()
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