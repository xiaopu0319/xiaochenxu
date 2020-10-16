/* login.js */
import IMService from '../../static/lib/imservice.js';
var app = getApp()



Page({
	data: {
		username:"",
		password:"",
		showError:false,
	},
	binduserName(e) {
    console.log("进来了")
    // console.log(e.detail)
    this.setData({
      username: e.detail
    })
  },
  bindpassword(e) {
    this.setData({
      password: e.detail
    })
	},
	// 根据name查询用户
  seeuser(name){
		console.log(name)
    console.log("用户");
    const db = wx.cloud.database();
    db.collection('register').where({
      userName:name
   }).get().then(res=>{
      console.log(res.data[0].userSex);
			getApp().globalData.Sex=res.data[0].userSex;
			getApp().globalData.withlovename=name;
			wx.switchTab({
				url:'../one/one'
			})
   })
   },


	login: function(e) {
		// 将IMService定义为全局变量
		var service = app.globalData.imService = new IMService();
	    // console.log(e.detail)
		var username = this.data.username;
		var password =  this.data.password;
		console.log(username);
		console.log(password);
		if (username.trim() != "" && password.trim() != "") {
			if (service.login(username, password)) {
						 console.log("零次")
				this.seeuser(username);
		//    把对象  name 存到公共类中
				service.connectIM();
				return;
			}
		}else{
			wx.showToast({
        title: "登录失败，检查用户名，密码是否输入正确",
        icon: "none",
        duration: 1500,
        mask: true
      });
		}
		this.setData({
			showError:true
		});
	},
	tapregister:function(e){
		wx.navigateTo({
			url: '../loginDQ/loginDQ'
			})

	},
	  // 跳回
		onClickLeft(){
			wx.navigateBack({
				 delta: 1 //跳转的级数
				 })
	
		},
})