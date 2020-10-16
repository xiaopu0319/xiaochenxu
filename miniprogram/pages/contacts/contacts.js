/* contacts.js */

const app = getApp()

Page({
	data: {
		groups:[],
		friends:[],
		currentUser:{},
	},
	onShow () {
		app.globalData.imService.onFriendListChange = this.onFriendListChange;
		this.setData({
			groups: app.globalData.imService.groups,
			friends: app.globalData.imService.friends,
			currentUser: app.globalData.imService.currentUser
		});
		this.setUnreadAmount();
		let service = app.globalData.imService;
		//监听会话变化
		service.onConversationsUpdate = (conversations) => {
			this.setUnreadAmount();
		};
	},
	onUnload(){
		app.globalData.imService.disconnect();
	},
	enterPrivateChat (e) {//进入私聊
		let service = app.globalData.imService;
		var friend = e.currentTarget.dataset.friend;
	console.log(friend);
	console.log(e.currentTarget.dataset);
		//关闭会话监听，微信端如果在非tabbar页面调用tabbar的方法会报错，这种方式为临时方案，如果有更好的方式也可以联系我们
		service.onConversationsUpdate = function () {}
		//路由到会话页面
		wx.navigateTo({
			url: `../chat/privateChat/privateChat?friend=`+JSON.stringify(friend)
		
		
		});
	},
	enterGroupChat (e) {//进入群聊
		let service = app.globalData.imService;
		var group = e.currentTarget.dataset.group;

		//同私聊
		service.onConversationsUpdate = function () {}
		wx.navigateTo({
			url: `../groupChat/groupChat?group=`+JSON.stringify(group)
		});
	},
	  // 跳回
		onClickLeft(){
			wx.navigateBack({
				 delta: 1 //跳转的级数
				 })
	
		}, 
	onFriendListChange(friendList){
		this.setData({
			friends:friendList
		});
	},
	setUnreadAmount () {
		let unreadTotal = app.globalData.imService.conversations.unreadTotal;
		if(unreadTotal >0){
			wx.setTabBarBadge({
				index: 0,
				text: unreadTotal.toString()
			})
		}else{
			wx.hideTabBarRedDot({
				index :0
			})
		}
	}
})
