const app = getApp()
Page({
	data : {
		conversations : {
			unreadTotal : 0,
			conversations : []
		},
		friends : null,
		groups : null
	},
	onLoad () {		
		let service = app.globalData.imService;
		if(!service.currentUser){
			uni.navigateTo({
				url : '../login/login'
			})
		}
	},
	contacts(){
		wx.navigateTo({
			url: "../contacts/contacts"
		});
	},
	onShow () {
		let service = app.globalData.imService;
		this.setData({
			friends : service.friends,
			groups : service.groups
		});

		//进入会话页面开启监听器
		service.onConversationsUpdate = (conversations) => {
			this.setConversations(conversations)
		};
	

		//进入会话页面 同步会话信息
		this.setConversations(service.conversations)
	},
	setConversations (conversations) {
		conversations.conversations && conversations.conversations.map((item) => {
			item.formatDate = app.globalData.imService.formatDate(item.lastMessage.timestamp)
		})
		this.setData({
			conversations : conversations
		})

		//设置tabbar的未读消息总数
		this.setUnreadAmount();
	},
	navigateToChat (e) {

		//移除会话监听器
		app.globalData.imService.onConversationsUpdate = function () {}
		
		let conversation = e.currentTarget.dataset.conversation;
		if (conversation.type == 'private') {
			wx.navigateTo({
				url : '../chat/privateChat/privateChat?friend=' + JSON.stringify(this.data.friends[conversation.userId])
			})
		}else{
			wx.navigateTo({
				url : '../chat/groupChat/groupChat?group=' + JSON.stringify(this.data.groups[conversation.groupId])
			})
		}
	},
	setUnreadAmount () {
		if(this.data.conversations.unreadTotal >0){
			wx.setTabBarBadge({
				index: 0,
				text: this.data.conversations.unreadTotal.toString()
			})
		}else{
			wx.hideTabBarRedDot({
				index :0
			})
		}
	}
})