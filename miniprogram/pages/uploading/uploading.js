Page({
  data: {
    fileList: [
      { 
        url: '',
        deletable: true,
    }
    
    ],
    src:'',
  },

  // 上传图片

 /**
选择文件上传到云存储
*/
// upload(){
//   // let that = this;
//   // 选择一张图片
//   wx.chooseImage({
//     count: 5,
//     sizeType: ['original', 'compressed'],
//     sourceType: ['album', 'camera'],
//     success: (res) => {
//       // tempFilePath可以作为img标签的src属性显示图片
//       const tempFilePaths = res.tempFilePaths[0]
//       // that.uploadFile(tempFilePaths) 如果这里不是=>函数
//       //则使用上面的that = this
//       this.uploadFile(tempFilePaths) 
//     },
//   })
// },
// //上传操作

// uploadFile(filePath) {
//   var imgName = null;
//   wx.cloud.uploadFile({
//     cloudPath: (new Date()).valueOf()+'.png', // 文件名
//     filePath: filePath, // 文件路径
//     success: res => {
//       // get resource ID
//       console.log(res.fileID);
//       imgName = res.fileID;
//       // var obj = imgName.lastIndexOf("/");
//       // imgName = obj;
//     //  console.log(obj);
//       // console.log( this.data.fileList[0].url);
//       this.data.fileList[0].url='https://7869-xiaopu-kxzgf-1302800822.tcb.qcloud.la/';
//       console.log( this.data.fileList[0].url);
//     },
//     fail: err => {
//       // handle error
//     }
//   })
// },



// 选择图片
selectImg: function () {
  var that = this;
  wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      //res.tempFilePaths 返回图片本地文件路径列表
      var tempFilePaths = res.tempFilePaths;
      that.setData({
        imgPath: tempFilePaths[0]
      })

    }
  })

},
// 预览图片
previewImg: function (e) {
  var img = this.data.imgPath;
  // 设置预览图片路径
  wx.previewImage({
    current: img,
    urls: [img]
  })
},
// 上传图片
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
    success: function (res) {
    //   console.log(res.fileID);
    //   const  imgname =    res.fileID;
    //   const  obj  = imgname.lastIndexOf("/");
    //  console.log(obj);
    //    const   jj = imgname.substring(obj);
    //    console.log(jj);
      wx.showToast({
        title: "图像上传成功！",
        icon: "",
        duration: 1500,
        mask: true
      });
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



// 上传视频
chooseVideo: function() {
  var that = this
  wx.chooseVideo({
    success: function(res) {
      that.setData({
        src: res.tempFilePath,
      })
    }
  })
},
//上传视频 目前后台限制最大100M，以后如果视频太大可以在选择视频的时候进行压缩
uploadvideo: function() {
  var src = this.data.src;
  wx.uploadFile({
    url: 'http://172.16.98.36:8080/upanddown/upload2',//服务器接口
    method: 'POST',//这句话好像可以不用
    filePath: src,
    header: {
      'content-type': 'multipart/form-data'
    },
    name: 'files',//服务器定义的Key值
    success: function() {
      console.log('视频上传成功')
    },
    fail: function() {
      console.log('接口调用失败')
    }
  })
},



onClickLeft (){
    wx.navigateBack({
       delta: 1 //跳转的级数
       })

  },
  big(){
  
 console.log("太大了")
  }


});