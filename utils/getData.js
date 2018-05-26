import cyutil from './url.js'
// import getData from "../../utils/getData.js"         //引入的文件
// getData.getaxios(this, {                     //this 一定要写
//   url: 'courseinfoListRec',      //请求的URL      //类型字符串    //必填
//   data: {},                      //前后台传的参数       //类型对象
//   sourceData: ['selectedList'], //需要的数据源里面渲染请求回来的数据名称 //类型数组里面字符串
//   updateData: ['list'],  //需要在请求回来的数据里面提取的数据名称    //类型数组里面字符串
//   callback: this.bind,   //成功的回调                 //类型函数
//   requestType: "POST"    //请求类型（默认GET）        //类型字符串
// })

//多个一起请求
// getData.getaxios(this, {
//   url: ['courseinfoListRec', 'getSlideImgs', 'courseclassplatList'],
//   data: [{}, {}, {}],
//   sourceData: [['selectedList'], ['carouselImg'], ['mallticket']],
//   updateData: [['list'], ['slideImgs'], ['list']],
// })
function getaxios(that,obj){
  typeof obj.url
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  console.log(typeof obj.callback)
  if (typeof obj.url === 'string') {
    if (obj.requestType === "POST") {
      wx.request({
        url: cyutil[obj.url],
        data: obj.data,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          wx.hideLoading()
          console.log(res.data)
          if (res.data.code == 0) {
            var param = {};
            for (let i = 0; i < obj.updateData.length; i++) {
              param[obj.sourceData[i]] = res.data[obj.updateData[i]];
            }
            that.setData(param);
            if (typeof obj.callback == 'function'){
              obj.callback()
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              duration: 1500
            })
          }
        },
        fail: function (rej) {
          wx.hideLoading()
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
          console.log(rej)
        }
      })
    } else {
      wx.request({
        url: cyutil[obj.url],
        data: obj.data,
        success: res => {
          wx.hideLoading()
          console.log(res.data)
          if (res.data.code == 0) {
            var param = {};
            for (let i = 0; i < obj.updateData.length; i++) {
              param[obj.sourceData[i]] = res.data[obj.updateData[i]];
            }
            that.setData(param);
            if (typeof obj.callback == 'function') {
              obj.callback()
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1500
            })
          }
        },
        fail: function (rej) {
          wx.hideLoading()
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
          console.log(rej)
        }
      })
    }
  } else if (typeof obj.url === 'object'){
    for(var i = 0; i < obj.url.length; i++){
      if (obj.requestType === "POST") {
        let ost = i
        wx.request({
          url: cyutil[obj.url[ost]],
          data: obj.data[ost],
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            if (i === obj.url.length){
              wx.hideLoading()
            }
            wx.hideLoading()
            console.log(res.data)
            if (res.data.code == 0) {
              var param = {};
              for (let o = 0; o < obj.updateData[ost].length; o++) {
                param[obj.sourceData[ost][o]] = res.data[obj.updateData[ost][o]];
              }
              that.setData(param);
              if (typeof obj.callback === 'object'){
                if (typeof obj.callback[i] === 'function') {
                  obj.callback[i]()
                }
              }else{
                if (typeof obj.callback === 'function') {
                  obj.callback()
                }
              }
            } else {
              wx.showToast({
                title: res.data.msg,
                duration: 1500
              })
            }
          },
          fail: function (rej) {
            wx.hideLoading()
            wx.showToast({
              title: '第' + ost + '个接口错误',
              icon: 'none',
              duration: 1000
            })
            console.log(rej)
          }
        })
      } else {
        let ost = i
        wx.request({
          url: cyutil[obj.url[ost]],
          data: obj.data[ost],
          success: res => {
            if (i === obj.url.length) {
              wx.hideLoading()
            }
            console.log(res.data)
            if (res.data.code == 0) {
              var param = {};
              for (let o = 0; o < obj.updateData[ost].length; o++) {
                param[obj.sourceData[ost][o]] = res.data[obj.updateData[ost][o]];
              }
              that.setData(param);
              if (typeof obj.callback === 'object') {
                if (typeof obj.callback[i] === 'function') {
                  obj.callback[i]()
                }
              } else {
                if (typeof obj.callback === 'function') {
                  obj.callback()
                }
              }
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 1500
              })
            }
          },
          fail: function (rej) {
            wx.hideLoading()
            wx.showToast({
              title: '第' + ost + '个接口错误',
              icon: 'none',
              duration: 1000
            })
            console.log(rej)
          }
        })
      }
    }
  }
}
  // let list = [
  //   {
  //     name: 'seqId',                  //要转化为的对象名称
  //     datas: this.data.srqId,         //转化的数据源（要判断是否为空的数据）
  //     prompt: '',                     //判断数据为空后的提示（最好不要超过7位）
  //     need: false                     //是否要判断这个数据
  //   },
  //   {
  //     name: 'courseName',              //要转化为的对象名称
  //     datas: this.data.liveName,       //转化的数据源（要判断是否为空的数据）
  //     prompt: '请输入直播主题',         //判断数据为空后的提示（最好不要超过7位）
  //     need: true                       //是否要判断这个数据
  //   }
  // ]
  // getData.setObj(list)

function conversion(obj){
  let datas = {}
  for (let item of obj) {
    datas[item['name']] = item['datas']
    if (item['need']) {
      if (item['datas'] === '' || item['datas'] === undefined) {
        wx.showToast({
          title: item['prompt'],
          icon: 'none'
        })
        return;
      }
    }
  }
  return datas
}


export default {
  getaxios: getaxios,
  conversion: conversion
}
