import cyurl from "../../utils/url";
var WxParse = require('../wxParse/wxParse.js');

// pages/infoDetail/infoDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seqId:"", //文章编号
    busiType:"content",
    bean:{  //文章对象

    },
    replyContent:"",  //回复内容
    showFile:0, //显示可下载的文件列表
  },

  onShareAppMessage: function (res) {
    let that = this;
    let seqId = that.data.seqId;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: that.data.bean.infoTitle,
      path: '/pages/infoDetail/infoDetail?seqId=' + seqId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  // html标签解析
  parse: function () {
    let that = this;
    let infoContent = that.data.bean.infoContentStr;
    WxParse.wxParse('infoContent', 'html', infoContent, that, 5);
  },

  //点击下载图标，切换显示资源列表
  toggleShowDown:function(e){
    let that = this;
    let showFile = that.data.showFile;
    console.log("old showFile",showFile)
    showFile = showFile ==1?0:1;
    console.log("new showFile",showFile);
    that.setData({
      showFile:showFile
    })
  },

  //文件下载逻辑
  //点击下载  -- 保存到本地
  //再次点击打开(临时文件)

  //点击文件 下载 或 打开 或 提示已下载
  // 没下载 --> 下载 --> 保存
  // 已下载 --> 您已下载
  downEvent:function(e){
    let that = this;
    let bean = that.data.bean;
    let fileInfoList = that.data.bean.fileInfoList;
    let index = e.currentTarget.dataset.index;
    let isdown = fileInfoList[index].isdown;
    let filePath = e.currentTarget.dataset.filepath;
    let seqId = e.currentTarget.dataset.seqid;
    let savedFilePath;
    console.log("isdown", isdown)
    if(isdown == 1){
      savedFilePath = fileInfoList[index].savedFilePath;
      wx.openDocument({
        filePath: savedFilePath,
        success: function (res) {
          console.log('打开文档成功')
        },
        fail: function (res) {
          wx.showToast({
            image: "/images/hint.png",
            title: '打开失败',
          })
          console.log('打开文档失败')
        },
        complete: function (res) {
          console.log(res)
        }
      })
    }else{
      //  下载文件请求后台，用于用户积分
      that.download(seqId);
      wx.downloadFile({
        url: filePath, //仅为示例，并非真实的资源
        success: function (res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            let tempFilePath = res.tempFilePath
            wx.saveFile({
              tempFilePath: tempFilePath,
              success: function (res) {
                savedFilePath = res.savedFilePath
                wx.showToast({
                  title: '保存成功',
                })
                isdown = 1;
                fileInfoList[index].isdown = isdown;
                bean.fileInfoList[index].isdown = 1;
                bean.fileInfoList[index].savedFilePath = savedFilePath;
                that.setData({
                  bean:bean
                });

                wx.openDocument({
                  filePath: savedFilePath,
                  success: function (res) {
                    console.log('打开文档成功')
                  },
                  fail: function (res) {
                    wx.showToast({
                      image: "/images/hint.png",
                      title: '打开失败',
                    })
                  }
                })

              },
              fail: function (res) {
                wx.showToast({
                  image: "/images/hint.png",
                  title: '保存失败',
                })
                return
              }
            })
          } else {
            wx.showToast({
              image: "/images/hint.png",
              title: '下载失败',
            })
            return
          }
        },
        fail: function (res) {
          wx.showToast({
            image: "/images/hint.png",
            title: '下载失败',
          })
          return
        }
      })
    }
  },

  //下载文件请求后台，用于用户积分
  download:function(fileId,e){
    let that = this;
    let seqId = that.data.seqId;
    let mbId= wx.getStorageSync("mbId");
    let openId = wx.getStorageSync("openId");
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: cyurl.download,
      header: {
        'content-type': 'application/json'
      },
      data:{
        seqId:seqId,
        mbId: mbId,
        fileId: fileId,
      },
      success: function (res) {
        console.log("下载文件请求后台 res-->", res)
        if (res.data.code == 0) {
         wx.showToast({
            title: "获得积分",
          })
        } else {
         
        }
      },
      fail: function (res) {
       
        console.log("下载文件请求后台 Err-->", res)
      },
      complete:function(res){
        wx.hideLoading()
      }
    })
  },

  //点赞
  dianZan:function(e){
    let that = this;
    let seqId = that.data.seqId;
    let sfdz = e.currentTarget.dataset.sfdz;
    let openId = wx.getStorageSync("openId");
    if(sfdz == 1){
      wx.showToast({
        image: "/images/hint.png",
        title: '只能赞一次哦',
      })
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: cyurl.zan,
      header: {
        'content-type': 'application/json'
      },
      data:{
        seqId:seqId,
        openId: openId
      },
      success: function (res) {
        console.log("点赞 res-->", res)
        if (res.data.code == 0) {
          //获取文章详情
          that.getInfoDeatil()
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: res.data.msg,
          })
        }
      },
      fail: function (res) {
        console.log("点赞 Err-->", res)
      },
      complete: function (res) {
        setTimeout(function(){          
          wx.hideLoading()
        },2000)
      }
    })
  },

  //收藏
  shouCang:function(e){
    let that = this;
    let seqId = that.data.seqId;
    let sfsc = e.currentTarget.dataset.sfsc;
    let openId = wx.getStorageSync("openId");
    if(sfsc == 1){
      wx.showToast({
        image: "/images/hint.png",
        title: '已经收藏了哦',
      })
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: cyurl.like,
      header: {
        'content-type': 'application/json'
      },
      data:{
        seqId:seqId,
        openId: openId
      },
      success: function (res) {
        console.log("收藏 res-->", res)
        if (res.data.code == 0) {
          wx.showToast({
            title: "收藏成功",
          })
          setTimeout(function(){
            //获取文章详情
            that.getInfoDeatil()
          },1500)
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: res.data.msg,
          })
        }
      },
      fail: function (res) {
        console.log("收藏 Err-->", res)
      },
      complete: function (res) {
        setTimeout(function(){          
          wx.hideLoading()
        },2000)
      }
    })
  },

  //获取文章详情
  getInfoDeatil:function(e){
    let that = this;
    let seqId = that.data.seqId;
    let busiType = that.data.busiType;
    let openId = wx.getStorageSync("openId");
    let mbId = wx.getStorageSync("mbId");
    let reqData={
      seqId: seqId,
      openId: openId,
      mbId: mbId
    };
    if (busiType == 'topicReply'){
      reqData.busiType = 'topic'
    }else{
      reqData.busiType = 'content'      
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: cyurl.infoDeatil,
      header: {
        'content-type': 'application/json'
      },
      data: reqData,
      success: function (res) {
        console.log("获取文章详情 -->", res)
        if (res.data.code == 0) {
          var bean = res.data.bean;
          that.setData({
            bean: bean
          })
          that.parse();
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: '详情获取失败',
          })
        }
      },
      fail: function (res) {
        console.log("获取文章详情 Err-->", res)
      },
      complete: function (res) {
        setTimeout(function(){          
          wx.hideLoading()
        },2000)
      }
    })
  },

  //保存输入的回复内容
  saveInput:function(e){
    let that = this;
    let value = e.detail.value;
    that.setData({
      replyContent:value
    })
  },

  //  发送评论内容
  saveReplySimple:function(e){
    let that = this;
    let infoId = that.data.seqId;
    let replyContent = that.data.replyContent;
    let openId = wx.getStorageSync("openId");
    let busiType = that.data.busiType;
    let reqData = {
      infoId: infoId,
      replyContentStr: replyContent,
      openId: openId
    };
    if (busiType == 'topicReply'){
      reqData.busiType = 'topicReply';
    }
    if(replyContent.trim() == '' || replyContent == undefined ){
      wx.showToast({
        image:"/images/hint.png",
        title:"内容为空"
      })
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: cyurl.reply,
      header: {
        'content-type': 'application/json'
      },
      data: reqData,
      success: function (res) {
        console.log("发送评论内容 -->", res)
        if (res.data.code == 0) {
          wx.showToast({
            title: '评论成功'
          })
          that.setData({
            replyContent:""
          });
          setTimeout(function(){
            //获取文章详情
            that.getInfoDeatil();
          },1500)
        } else {
          wx.showToast({
            image: "/images/hint.png",
            title: '评论失败',
          })
        }
      },
      fail: function (res) {
        console.log("发送评论内容 Err-->", res)
      },
      complete: function (res) {
        setTimeout(function(){          
          wx.hideLoading()
        },2000)
      }
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
        setTimeout(function(){          
          wx.hideLoading()
        },2000)
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
    this.getCurrentPageUrl();
    console.log("文章、话题详情页 options -->",options);
    // console.log(currentPageUrl);
    let salseIsLogin = wx.getStorageSync("salseIsLogin");
    console.log("salseIsLogin -->", salseIsLogin);
    if (!salseIsLogin) {
      wx.redirectTo({
        url: "/pages/login/login?needback=true&backIsMenu=false"
        // url: "/pages/login/login?needback=true&currentPageUrl="+"/pages/infoDetail/infoDetail?seqId=589&shareMbId=11494&from=share"+"&backIsMenu=false"
      })
    }
    if (options.shareMbId){
      this.setData({
        shareMbId: options.shareMbId
      })
      this.shareSales();
    }
    if (options.busiType == 'topicReply'){
      this.setData({
        busiType: options.busiType
      })
    }
    let seqId = options.seqId;
    that.setData({
      seqId:seqId,
    });
    //获取文章详情
    that.getInfoDeatil();
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
    console.log(888888888);
    
    wx.getSavedFileList({
      success: function (res) {
        console.log("已下载的文件列表 -->",res.fileList)	//文件列表
      }
    })
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
      title: '文章详情',
      // path: '/page/couponDetail/couponDetail?from=share&shareMbId=' + shareMbId + '&seqId=' + seqId,
      path: '/pages/infoDetail/infoDetail?from=share&shareMbId='+shareMbId+'&seqId='+seqId,
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