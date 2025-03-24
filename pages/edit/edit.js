Page({
  data: {
    options: [],
    newOption: ''
  },

  onLoad() {
    // 从本地存储加载选项
    const options = wx.getStorageSync('wheelOptions') || [];
    this.setData({ options });
  },

  onInput(e) {
    this.setData({
      newOption: e.detail.value
    });
  },

  addOption() {
    if (!this.data.newOption.trim()) {
      wx.showToast({
        title: '请输入选项内容',
        icon: 'none'
      });
      return;
    }

    const options = this.data.options;
    options.push(this.data.newOption.trim());
    
    this.setData({
      options: options,
      newOption: ''
    });
  },

  deleteOption(e) {
    const index = e.currentTarget.dataset.index;
    const options = this.data.options;
    options.splice(index, 1);
    
    this.setData({
      options: options
    });
  },

  saveOptions() {
    if (this.data.options.length < 2) {
      wx.showToast({
        title: '至少需要2个选项',
        icon: 'none'
      });
      return;
    }

    // 保存到本地存储
    wx.setStorageSync('wheelOptions', this.data.options);
    
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500,
      success: () => {
        // 延迟返回上一页
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    });
  }
});
