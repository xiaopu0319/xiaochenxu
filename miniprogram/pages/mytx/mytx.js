// miniprogram/pages/mytx/mytx.js
  var  app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   // 图片路径前缀
   imgurl:'https://7869-xiaopu-kxzgf-1302800822.tcb.qcloud.la',
   //  上传到数据库：操作容器
      imges:'',
  //  数组 接受的容器
     img:[],
// 显示图片
     background: [],
  // 弹出层  show
  tcshow:false,
  // 头像id

  txid:[],
  txidt:[],
// 点击 active 切换
  activeItem:"0",

  imgid:'',
  imgname:'',
  },


  // 弹出层确认
  notarize:function(e){
    console.log("确认");
     //  上传到数据库
     var name = app.globalData.withlovename;
   this.addimg(name);

   },
// 取消
  tcshow(e){
   this.setData({tcshow:true});
  },
cancel:function(){
this.setData({tcshow:false});

},
// 选择图片上传
selectImg: function () {
  var that = this;
  wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: res=> {
      //res.tempFilePaths 返回图片本地文件路径列表
      var tempFilePaths = res.tempFilePaths;
      that.setData({
        imgPath: tempFilePaths[0]
      })
      this.loadImg();
    }
  })

},
// 点击上传操作
loadImg: function () {
  var that = this;
  wx.cloud.uploadFile({
    cloudPath: (new Date()).valueOf()+'.png', // 文件名
    filePath: that.data.imgPath, // 文件路径
  
    name: "upload_file",
    // 请求携带的额外form data
    /*formData: {
      "id": id
    },*/
    header: {
      'Content-Type': "multipart/form-data"
    },
    success: res=> {
      // console.log(res);
      console.log(res.fileID);
      const  imgname =    res.fileID;
      const  obj  = imgname.lastIndexOf("/");
    //  console.log(obj);
       const   jj = imgname.substring(obj);
       console.log(jj);
         this.setData({imges:jj});
      wx.showToast({
        title: "图像上传成功！",
        icon: "",
        duration: 1500,
        mask: true
      });
      // 成功后显示弹出框
      this.tcshow();

    },
    fail: function (res) {
      wx.showToast({
        title: "上传失败，请检查网络或稍后重试。",
        icon: "none",
        duration: 1500,
        mask: true
      });
    }

  })
},
// 添加到指定 用户的资料图片
addimg(name){
  const db = wx.cloud.database();
  db.collection('Img').add({
 data:{
  imgName:this.data.imges,
  imgState:0,
  tx:0,
  userName:name
 },
 success: res => {
  console.log(res+'返回的数据');
 },  
 fail: res => {
  console.log(err)
 }
  })
},

// 点击图片  添加
addVideo(){
  var name = app.globalData.withlovename;
  console.log("添加图片");
    this.selectImg(name);


},

  // 根据name 查找照片
  photo:function(name){
    console.log("照片")
    const db = wx.cloud.database();
    db.collection('Img').where({
       userName:name
    }).get().then(res=>{
    //  var y =  res.data.legth;
    // console.log(res)
    // console.log(res.data.length)
    for (var x in res.data) {//x = index
      
      if(res.data[x].imgState==1){
      this.data.img.push(this.data.imgurl+res.data[x].imgName);
      this.data.txid.push(res.data[x]._id);
      // this.data.pages.push(x);
      }
  }
      // console.log(this.data.img)
      this.setData({background : this.data.img,txidt:this.data.txid})
     
    })
  },
  // 点击图片  预览
  headPortrait(e){
    var that = this;
    //获取下标
    that.setData({
      activeItem: e.currentTarget.id
    })
    console.log(e.currentTarget.id+"下标");
    //   预览图片
      console.log(e.currentTarget.dataset.src)
      let currentUrl = e.currentTarget.dataset.src
      wx.previewImage({
        current: currentUrl, // 当前显示图片的http链接
        urls:this.data.background // 需要预览的图片http链接列表
      })
    
  },
  // 选择头像
  sctx(e){
 console.log(this.data.activeItem);

 const db = wx.cloud.database(); 
//  this.data.img
  //  for(var x in this.data.txidt){
  //   //  循环到指定的选择图片修改  tx值
  //   if(x==this.data.activeItem){
  //     db.collection('Img').doc(this.data.txidt[x]).update({
  //       data:{
  //         tx:1
  //       }
  //     }).then(res=>{
  //   console.log(res+"头像");
  // }).catch(res=>{
  //   console.log(res+"头像");
  // })
  
  //   }

  //     db.collection('Img').doc(this.data.txidt[x]).update({
  //       data:{
  //         tx:0,
  //       }
  //     })
  //     .then(res=>{
  //   console.log(res);
  // }).catch(res=>{
  //   console.log(res);
  // })
  console.log(app.globalData.withlovename);
  this.updatatxUser(app.globalData.withlovename);
  // 循环
// }
  },
//把头像修改成功后放在user表
   updatatxUser(name){
     console.log("进入")

    const db = wx.cloud.database(); 
    db.collection('Img').where({
      userName:name
    }).get().then(res=>{
      console.log(res.data)
      for(var  x  in res.data){
        if(res.data[x].imgState==1){
          // if(res.data[x].tx==1){
            console.log(res.data[x].imgName)
            // 插入
            this.setData({imgname:res.data[x].imgName});
            // 根据name 查询用户表的name  _id


            // app.globalData.withlovename
            this.seetxUser(app.globalData.withlovename);
          // }
        }
      
      }
    })
   },
  //  根据name查询id
    seetxUser(name){
      console.log(name);
      // var  img = imgName;
      const dbd = wx.cloud.database(); 
      dbd.collection('register').where({
        userName:name
      }).get().then(res=>{
        console.log(res.data[0]._id);
        this.setData({imgid:res.data[0]._id})
        // 最后修改
       this.updataUserimg();
      })
    },
    updataUserimg(){
      console.log(this.data.imgid);
      console.log(this.data.imgname);
      const dbb = wx.cloud.database(); 
      dbb.collection('register').doc(this.data.imgid).update({
        data:{
          userImg:this.data.imgname
        }
      }).then(res=>{
        console.log(res);
      }).catch(res=>{
        console.log(res);
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.updatatxUser("张三");

    
    var name = app.globalData.withlovename;
    // // 模拟
    // // 杰克辣舞
    this.photo(name);
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
    // var name = app.globalData.withlovename;
    // this.photo(name);
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
   // 跳回
   onClickLeft(){
    wx.navigateBack({
       delta: 1 //跳转的级数
       })

  }, 

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})