app.router('UploadVideo', async (ctx) => {
  await db.collection('seriesLessons').add({
    data: {
      // avatarUrl: event.avatarUrl,
      // nickName: event.nickName,
      // openId: event.openId,
      // level: event.level,
      // company: event.company,
      // createTime: event.createTime, //创建时间
      // timestamp: event.timestamp, //时间戳
      // className: event.className, //内容标签
      // coverTitle: event.coverTitle, //内容标题
      // coverImg: event.coverImg,
      // text: event.text, //内容详情
      media: {
        imgWidth: event.imgWidth,
        imgUrls: event.imgUrls
      }, //图片视频文件
      pay: event.pay,
      price:event.price,
      collection: [],
      dianzan: [],
      pinglun: [],
      zhuanfa: []
    },
    success(res) {
      ctx.body = {
        event,
        message: '动态发布成功'
      }
    }
  })
});