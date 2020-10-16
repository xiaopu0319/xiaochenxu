const app=getApp();


import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
wx.cloud.init();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // userInfo: [],//用户信息
    // title: '', //课程标题
    // desc: '', //课程内容简介
    // classifyName: '', //标签分类
    // price:"",//课程价格
          // 图片路径前缀
   imgurl:'https://7869-xiaopu-kxzgf-1302800822.tcb.qcloud.la',
    accept:'video',//上传内容格式，video
    fileList: [], //上传文件临时存储
    fileIDs: [],//文件上传后获取云数据中的位置
    // 输入框存放集合
    dongtaivalue:[],
    select: false,
    select_value1: {
      "id": "0",
      "text": "未选择"
    },

    // 选择图片
    show: false,


  },

  showPopup() {
    this.setData({
      show: true
    });
  },
  // 输入框发生变化，
  dongtaivlaue(e){
    console.log("动态库")
    console.log(e.detail.value);
  this.setData({dongtaivalue:e.detail.value});
    },
  onClose() {
    this.setData({
      show: false
    });
  },

 


  // 获取视频临时存储
  afterRead(event) {
    let that = this;
    // console.log(event)
    let obj = event.detail
    
    // console.log(obj)
    let NewfileList = {}
        NewfileList.url = obj.file.tempFilePath
        NewfileList.name = "video"+obj.index
        NewfileList.index=obj.index
        NewfileList.type = 'video'
        NewfileList.duration = obj.file.duration
        NewfileList.size=obj.file.size
    let fileList = []
      fileList.push(...that.data.fileList, NewfileList);
      that.setData({
        fileList :fileList
      })
    console.log(that.data.fileIDs)
    
  },

  // 删除其中一张图片
  Delete(event) {
    let that = this
    console.log(event)
    console.log(event.detail.index)
    wx.showModal({
      title: '要删除这个文件吗？',
      content: '',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          that.data.fileList.splice(event.detail.index, 1);
          that.setData({
            fileList: that.data.fileList
          })

        }
      }
    })
  },


   //上传数据
   publish() {
    let that=this
  //   var title=that.data.title;
  //   var price=that.data.price;
  //   var classifyName=that.data.classifyName;
  //   var desc = that.data.desc;
   //  var fileList = that.data.fileList;
  //   if (!title) {
  //     wx.showToast({
  //       icon: "none",
  //       title: '请输入课程标题'
  //     })
  //     return
  // }
  // if(!price) {
  //   wx.showToast({
  //     icon: "none",
  //     title: '请输入课程价格'
  //   })
  //   return
  // }
  // if(!classifyName) {
  //     wx.showToast({
  //       icon: "none",
  //       title: '请选择课程分类'
  //     })
  //     return
  //   }
  //   if (!desc || desc.length < 6) {
  //     wx.showToast({
  //       icon: "none",
  //       title: '请输入课程简介'
  //     })
  //     return
  //   }
    
    wx.showLoading({
      title: '正在上传...',
    })
    //遍历临时存储数组，实现上传
    const promiseArr = []
    for (let i = 0; i < that.data.fileList.length; i++) {
      let filePath = that.data.fileList[i].url
      let type=that.data.fileList[i].type
       let duration=that.data.fileList[i].duration
      let title=that.data.fileList[i].name
      let index=that.data.fileList[i].index
      // console.log(filePath)
      let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
      //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
      promiseArr.push(new Promise((reslove, reject) => {
        wx.cloud.uploadFile({
          //'seriesLesson/'  是自定义云存储的文件夹位置，如果不加就是默认存储到云存储根目录下。
          cloudPath:new Date().getTime() + suffix,
          filePath: filePath, // 文件路径
        }).then(res => {
          // 获取上传的文件位置，存到fileID中
          console.log("上传结果", res.fileID)
          var obj = res.fileID.lastIndexOf("/");
          const   jj = res.fileID.substring(obj);
          console.log(jj);
          that.setData({
            // duration:duration,
            // fileIDs: that.data.fileIDs.concat({type:type,url:res.fileID,duration:duration,index:index})
            fileIDs:jj
          })
          
          reslove()
        }).catch(error => {
          console.log("上传失败", error)
        })
      }))
    }
    //保证所有文件都上传成功
    Promise.all(promiseArr).then(res => {
      var timestamp=(new Date()).getTime()
      wx.cloud.callFunction({
         name:'Upvidu',
         data:{
           $url:'UploadVideo',
          //  avatarUrl:that.data.userInfo.weixinInfo.avatarUrl,
          //  nickName:that.data.userInfo.weixinInfo.nickName,
          //  level:that.data.userInfo.level,
          //  openId:that.data.userInfo.openId,
          //  company:that.data.userInfo.company,
          //  createTime:days(),//创建时间
          //  timestamp:timestamp,//当前时间戳
          //  className:classifyName,//内容标签
          //  coverTitle:title,//内容标题
          //  coverImg:that.data.fileIDs[0]?that.data.fileIDs[0].url:'',
          //  text:desc,//课程简介
         
           imgUrls:that.data.fileIDs?that.data.fileIDs:[],
           pay:true,
          //  price:Number(price)//课程价格
         },
         success: res => {
              wx.hideLoading()
              wx.showToast({
                title: '发布成功',
              })
              wx.cloud.callFunction({
                name:'Upvidu',
                data:{
                  $url:'selectMycourses',
                  timestamp:timestamp
                },
                success:res=>{
                   console.log(res.result.result.data[0]._id)
                   wx.cloud.callFunction({
                     name:'Upvidu',
                     data:{
                       $url:'addMycourses',
                       openId:res.result.result.data[0].openId,
                       _id:res.result.result.data[0]._id
                     },
                     success(res){
                        console.log(res)
                     }
                   })
                }
              })
              wx.showModal({
                title: '提示',
                content: '上传成功，是否需要返回首页?',
                success (res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '../myindex/myindex',
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
             
              
            },
          fail: err => {
              wx.hideLoading()
              wx.showToast({
                icon: 'none',
                title: '成功'
              })

              var name =app.globalData.withlovename;
              this.addDynamic(name,this.data.dongtaivalue)
              // console.error('发布失败', err)
            }

      })
     
    })
   
  },
  // 上传文字加视频
   //  添加动态文字   name   和文本内容
 addDynamic(name,dynamicText){
  console.log("添加动态");
 const  db = wx.cloud.database();
  db.collection('Dynamic').add({
   data:{
  userName:name,
  dynamicText:dynamicText,
  dynamicState:'0',
  // 视频是  2
  imgvideo:'2'
   },
  }).then(res => {
   // 创建好的id
   console.log(res._id)
   this.addDynamicImg(name,res._id);
 })
   },
 // 循环添加图片
 addDynamicImg(name,id){
  console.log("添加视频");
  const  dbd = wx.cloud.database();
  // for( var x  in  this.data.fileIDs){
    // console.log(this.data.fileIDs[x]);
    dbd.collection('Video').add({
      data:{
       dynamicID:id,
       videoName:this.data.fileIDs,
       videoState:'0',
       userName:name,
     },
     })
  // }
  //跳回
  this.onClickLeft();
},
onClickLeft(){
  wx.navigateBack({
     delta: 1 //跳转的级数
     })

}, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // this.addDynamic("陈迪",this.data.dongtaivalue);
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        console.log(res)
        that.setData({
          userInfo: res.data
        })
      

      }
    })

  },

  // 点击发布动态


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(this.data)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this.data.fileList)
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