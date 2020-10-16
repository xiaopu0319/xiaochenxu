// miniprogram/pages/news/news.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    list: [
      {
       "url":"pages/index/index",
       "icon":"like-o",
        "text":"寻爱"
      },
      {
       "url":"pages/news/news",
       "icon":"chat-o",
        "text":"消息"
      },
      {
       "url":"pages/finds/finds",
       "icon":"search",
        "text":"发现"
      },
      {
       "url":"pages/my/my",
       "icon":"manager-o",
        "text":"我"
      }
         ]
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
    console.log('消息')
    // this.getTabBar().init();
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