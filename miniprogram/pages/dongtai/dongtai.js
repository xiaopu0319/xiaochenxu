// pages/dongtai/dongtai.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
       // 图片路径前缀
   imgurl:'https://7869-xiaopu-kxzgf-1302800822.tcb.qcloud.la',
  //  文本改变值
  accept:'video',//上传内容格式，video
    dongtaivalue:'',
    // 预览图片
    arr:[],
    // 选择的图片
    dtIMG:[ ],
    fileIDs: [],//上传云存储后的返回值
    // 该发动态的id
    Dyid:'',
  },
    //发布按钮
    fb: function (e) {
      if (!this.data.dtIMG.length) {
        wx.showToast({
          icon: 'none',
          title: '图片类容为空'
        });
      } else {
          //上传图片到云存储
          wx.showLoading({
            title: '上传中',
          })
          let promiseArr = [];
          for (let i = 0; i < this.data.dtIMG.length; i++) {
            promiseArr.push(new Promise((reslove, reject) => {
              let item = this.data.dtIMG[i].path;
              let suffix = /\.\w+$/.exec(item);//正则表达式返回文件的扩展名
              wx.cloud.uploadFile({
                cloudPath: (new Date().getTime())+suffix,  // 上传至云端的路径
                filePath: item, // 小程序临时文件路径
                success: res => {
                  // 截取成功
                  var obj = res.fileID.lastIndexOf("/");
                  const   jj = res.fileID.substring(obj);

                  this.setData({
                    fileIDs: this.data.fileIDs.concat(jj)
                  });
                  console.log(res.fileID)//输出上传后图片的返回地址
                  reslove();
                  wx.hideLoading();
                  wx.showToast({
                    title: "上传成功",
                  })
                  // "cloud://xiaopu-kxzgf.7869-xiaopu-kxzgf-1302800822/1599536852645.jpg", "cloud://xiaopu-kxzgf.7869-xiaopu-kxzgf-1302800822/1599536852647.jpg"
                  console.log(this.data.fileIDs);
                },
                fail: res=>{
                  wx.hideLoading();
                  wx.showToast({
                    title: "上传失败",
                  })
                }
  
              })
            }));
          }
          Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
            console.log("图片上传完成后再执行")
        //  添加动态
        var   name=app.globalData.withlovename;
        //  var  name = "陈迪";
        this.addDynamic(name,this.data.dongtaivalue);
            this.setData({
              dtIMG:[]
            })
          })
  
        }
    },   

 
    // 输入框发生变化，
    dongtaivlaue(e){
    console.log("动态库")
    console.log(e.detail.value);
  this.setData({dongtaivalue:e.detail.value});
    },
    // DTFB动态发布
    DTFB(){
      // 点击发布
    // console.log(this.data.dongtaivalue);
      
    console.log(this.data.Dynamic_id);

     // 上传图片
    this.fb();

    // this.addDynamic('李艾',this.data.dongtaivalue);
  


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
  //
 //  添加动态
 addDynamic(name,dynamicText){
   console.log("添加动态");
  const  db = wx.cloud.database();
   db.collection('Dynamic').add({
    data:{
   userName:name,
   dynamicText:dynamicText,
     // 视频是  2  图片 1
  imgvideo:'1',
   dynamicState:'1'
    },
   }).then(res => {
    // 创建好的id
    console.log(res._id)
    this.addDynamicImg(name,res._id);
  })
    },
    // 循环添加图片
    addDynamicImg(name,id){
      console.log("循环添加图片");
      const  dbd = wx.cloud.database();
      for( var x  in  this.data.fileIDs){
        console.log(this.data.fileIDs[x]);
        dbd.collection('Img').add({
          data:{
           dynamicID:id,

           imgName:this.data.fileIDs[x],
           imgState:'0',
           userName:name,
         },
         })
      }
      //跳回
      this.onClickLeft();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
    // 跳回
    onClickLeft(){
      wx.navigateBack({
         delta: 1 //跳转的级数
         })
  
    }, 
})