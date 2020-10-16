/* groupMember.js */

const app = getApp()

Page({
	data: {
		currentUser : null,
		groupMembersMap : {},
	},
	onLoad(options){
		var group = JSON.parse(options.group);
		var groupMemberMap = app.globalData.imService.getGroupMembers(group.uuid);
		var groupMemberNum = Object.keys(groupMemberMap).length;
		this.setData({
			groupMemberNum: groupMemberNum,
			groupMembersMap: groupMemberMap,
		});
	},
})
