// miniprogram/pages/my/my.js

 var  app  = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 图片路径前缀
    imgurl:'https://7869-xiaopu-kxzgf-1302800822.tcb.qcloud.la',
      //  头像
    tximg:"",
    mydata:[]
  },
  // 用户查询
  userquery(withlovename){
          console.log("进入吗");
    const db = wx.cloud.database();
    db.collection('register').where({
      userName:withlovename
   }).get().then(res=>{
     console.log(res.data);
     var  arr = [];
     arr =    res.data;
     this.setData({mydata:arr});
     
   })
   },


  //  头像 查询
  //  txquery(withlovename){
          
  //   const db = wx.cloud.database();
  //   db.collection('Img').where({
  //     userName:withlovename
  //  }).get().then(res=>{
  //  //  var y =  res.data.legth;
  //  console.log(res.data)
  // for(var x in res.data){
  //   if(res.data[x].imgState==1){
  //     if(res.data[x].tx==1 ){
  //       console.log(res.data[x].imgName);
  //       this.setData({tximg:res.data[x].imgName})
  //     }
  //   }
    
  // }    
  //  })
  //  },

   
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
// 查询用户头像
    console.log(app.globalData.withlovename);
  //  this.txquery("张三");
var name = app.globalData.withlovename;
   this.userquery(name);
  //  看是否存入成功
   console.log(app.globalData.withlovename);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow :function(){
    console.log('显示')
    var name = app.globalData.withlovename;
    this.userquery(name);
  },

  myimges:function(){
    wx.navigateTo({
      url: '../uploading/uploading'
      })
  },
// 基本信息
  only:function(){
    wx.navigateTo({
      url: '../basicinformation/basicinformation'
      })
  },
  mytx:function(){
    wx.navigateTo({
      url: '../mytx/mytx'
      })
  },
  //择偶
  zeou:function(){
    // wx.navigateTo({
    //   url: '../mateSelection/mateSelection'
    //   })
  },
  // 查看关注列表
  gz:function(){
    wx.navigateTo({
      url: '../gz/gz'
      })
  },
  dongtai:function(){
  // 跳转动态
    console.log("动态")
    wx.navigateTo({
      url: '../myindex/myindex'
      })

  },
  quit(){
    console.log("退出");
    getApp().globalData.withlovename='';
    console.log(app.globalData.withlovename);
   
    wx.redirectTo({
      url: '../play/play'
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
  onShareAppMessage: function () {

  }
})