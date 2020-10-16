//index.js
const app = getApp()
Page({
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  data: {
    // 图片路径前缀
    imgurl:'https://7869-xiaopu-kxzgf-1302800822.tcb.qcloud.la',
//  上传到数据库：操作容器
   imges:'',

  //  数组 接受的容器
    img:[],
// 'https://img.onvshen.com:85/gallery/26740/33170/s/0.jpg', 'https://img.onvshen.com:85/gallery/26740/33170/s/0.jpg', 'https://img.onvshen.com:85/gallery/26740/33170/s/0.jpg'
// 图片轮播集合
    background: [],

    indicatorDots: false,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    show: false,
    
    // 弹出层  show
    tcshow:false,
// 指示点
swiperCurrent:'',
   // 传过来显示有多少个
    pages:[],
    // 显示到页面
   page:[],
       //  用户数据
       user:[],

       DDY:[],
    DynamicTT:[],
   // 动态用户表
    Dynamic:[], 

//  循环图片
    Dynamicarr :[],
    Dynamicimg:[],


// 循环视频id
    Dynamicvideo:[],
    Dyvideo:[],
 //视频本体
   videoDY:[],
   video:[],

    bid:0,   
  },
  
  methods:{
  
   
   },
   swiperChange:function(e){
    this.setData({
      swiperCurrent:e.detail.current,
      
    })
    // console.log(this.data.swiperCurrent)
  },
 



// 弹出层确认
   notarize:function(e){
     console.log("确认");
      var name = app.globalData.withlovename
      //  上传到数据库
    this.addimg(name);


    },
// 取消
   tcshow(e){
    this.setData({tcshow:true});
   },
cancel:function(){
this.setData({tcshow:false});
 
},

  // 指示点点击切换
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
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
  // 添加到指定 用户的资料图片   头像
  addimg(nmae){
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
  addVideo(e){
    console.log("添加图片");
      this.selectImg();
 

  },

    // 根据name 查找照片
    photo:function(username){
      console.log("照片")
      const db = wx.cloud.database();
      db.collection('Img').where({
         userName: username
      }).get().then(res=>{
      //  var y =  res.data.legth;
      // console.log(res)
      // console.log(res.data.length)
  

      for (var x in res.data) {//x = index
     
        if(res.data[x].imgState==1){
          if(res.data[x].tx==0){
            this.data.img.push(res.data[x].imgName);
            this.data.pages.push(x);
          }
         
        }
      
    }
        // console.log(this.data.img)
        this.setData({background : this.data.img,page: this.data.pages})
       
      })
    },
      // 根据name  查询用户数据
   seeuser(name){
    console.log("用户");
    const db = wx.cloud.database();
    db.collection('register').where({
      userName:name
   }).get().then(res=>{
      // console.log(res.data);
      var  arr = [];
      arr = res.data;
      this.setData({user:arr});
  // console.log(this.data.user);
   })
   },

    // 动态查询数据
       // 根据name  查询用户数据
     seeDynamic(name){
   
    const db = wx.cloud.database();
    db.collection('Dynamic').where({
      userName:name
   }).get().then(res=>{
    console.log("动态");
      console.log(res.data);

     
      for(var i in res.data){
      if(res.data[i].dynamicState==1){
        if(res.data[i].imgvideo==1){
          this.data.DynamicTT = res.data;
          //用户数据加载
          console.log("图片动态")
          this.setData({Dynamic:this.data.DynamicTT});
            console.log(this.data.Dynamic);
            this.seeDyimg();
        }else {
              // res.data[0].imgvideo==2  视频
        this.data.Dynamicvideo=res.data;
        console.log("图片视频")
        this.setData({Dyvideo:this.data.Dynamicvideo});
        console.log(this.data.Dyvideo);
        this.seeDyvieo();
        }
      }
     
      }
 
   })
   },
  //  查询动态图片
   seeDyimg(){
 const  dbdb = wx.cloud.database();
  //  var y  =this.data.Dynamic.length;
  console.log(this.data.Dynamic);
   for(const  x in this.data.Dynamic ){
    dbdb.collection('Img').where({
      dynamicID:this.data.Dynamic[x]._id
    }).get().then(res=>{
      console.log(x)
      console.log(res.data);
               this.data.Dynamicarr[x]=res.data;
               this.setData({Dynamicimg:this.data.Dynamicarr});
               console.log(this.data.Dynamicimg);
    })
   }
   },
  //  查询视频
   seeDyvieo(){
     const  dbdb = wx.cloud.database();
    //  console.log(this.data.Dyvideo[0]._id)
     for(const  x in this.data.Dyvideo){
      console.log(this.data.Dyvideo[x]._id)
      dbdb.collection('Video').where({
        dynamicID:this.data.Dyvideo[x]._id
      }).get().then(res=>{
        console.log(x)
        console.log(res.data);
        if(res.data[x].videoState==1){
          this.data.videoDY=res.data;
          this.setData({video:this.data.videoDY});
          console.log(this.data.video[x].videoName);
        }
       
      })
    }
   },
   onShow:function(){
    var username = app.globalData.withlovename;
    this.seeDynamic(username);
    // var    username = '宝蓝';
    this.seeDynamic(username);
   },
  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {       //options用于接收上个页面传递过来的参数
    // console.log(options.id);
    // console.log("照片")
    // console.log(app.globalData.withlovename);

    var username = app.globalData.withlovename;
    console.log(username);
  // var    username ='宝蓝';
  //  console.log(name);
    // 图片
     this.photo(username);
    //  数据
     this.seeuser(username);
     //动态数据
     this.seeDynamic(username);
     },


  refurbish(){
  console.log("模拟刷新");

  }, 
  dz:function(e){
    console.log("点赞");
  },
  zf:function(e){
    console.log("转发");
  },
  pl:function(e){
    console.log("评论");
  },
  // 发动态
  fbdt:function(){
    console.log("发布动态");
    wx.navigateTo({
      url: '../dongtai/dongtai'
      })
  },
  videodt:function(){
    console.log("视频动态");
    wx.navigateTo({
      url: '../aaa/aaa'
      })
  },
  // 打招呼
  hello:function(){
  console.log(打招呼)
  },
  // 关注
  onClose() {
    this.setData({ show: false });
  },
  
  attention:function(){
    this.setData({ show: true });
    console.log("关注成功")
  },
  // onShow: function () {
  //   console.log('个人中心')
  //   // this.getTabBar().init();
  // },
  onClick(event) {
    wx.showToast({
      title: `点击标签 ${event.detail + 1}`,
      icon: 'none',
    });
  },
  // 跳回
  onClickLeft(){
    wx.navigateBack({
       delta: 1 //跳转的级数
       })

  }, 



});
