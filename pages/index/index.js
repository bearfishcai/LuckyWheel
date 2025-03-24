Page({
  data: {
    // 页面数据
  },

  // 跳转到幸运转转乐页面
  navigateToWheel() {
    wx.navigateTo({
      url: '/pages/wheel/wheel'
    });
  },

  // 跳转到To Do List页面
  navigateToTodo() {
    wx.navigateTo({
      url: '/pages/todo/todo'
    });
  },

  onLoad: function() {
    // 页面加载时执行
  }
});
