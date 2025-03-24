Page({
  data: {
    options: [],
    rotating: false,
    result: '',
    angle: 0,
    isEditing: false,
    newOption: ''
  },

  onLoad() {
    this.loadOptions();
  },

  // 加载选项
  loadOptions() {
    const options = wx.getStorageSync('wheelOptions') || [];
    this.setData({ options });
  },

  // 切换编辑状态
  toggleEdit() {
    this.setData({
      isEditing: !this.data.isEditing,
      newOption: ''
    });
  },

  // 输入新选项
  onInput(e) {
    this.setData({
      newOption: e.detail.value
    });
  },

  // 添加选项
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

    // 保存到本地存储
    wx.setStorageSync('wheelOptions', options);
  },

  // 删除选项
  deleteOption(e) {
    const index = e.currentTarget.dataset.index;
    const options = this.data.options;
    options.splice(index, 1);
    
    this.setData({
      options: options
    });

    // 保存到本地存储
    wx.setStorageSync('wheelOptions', options);
  },

  // 开始旋转
  startSpin() {
    if (this.data.rotating || this.data.options.length < 2) return;
    
    this.setData({
      rotating: true,
      result: ''  // 清空之前的结果
    });

    // 随机生成旋转角度（逆时针旋转）
    const randomAngle = -(Math.floor(Math.random() * 360) + 720); // 至少转2圈
    const sectorAngle = 360 / this.data.options.length;
    
    // 计算最终指向的选项索引
    const finalAngle = Math.abs(randomAngle % 360);
    const resultIndex = Math.floor(finalAngle / sectorAngle);
    
    // 确保索引在有效范围内
    const safeIndex = resultIndex % this.data.options.length;

    // 动画效果
    this.animateSpin(randomAngle, () => {
      // 动画结束后的回调
    });
  },

  // 动画实现
  animateSpin(targetAngle, callback) {
    const duration = 3000;
    const startTime = Date.now();
    const startAngle = this.data.angle;
    const frameInterval = 16; // 约60fps
    const totalFrames = Math.ceil(duration / frameInterval);
    const anglePerFrame = targetAngle / totalFrames;
    let currentFrame = 0;

    const animate = () => {
      currentFrame++;
      const currentAngle = startAngle + (anglePerFrame * currentFrame);
      
      this.setData({
        angle: currentAngle
      });

      if (currentFrame < totalFrames) {
        setTimeout(() => {
          animate();
        }, frameInterval);
      } else {
        // 先设置旋转状态为false
        this.setData({
          rotating: false
        }, () => {
          // 等待约3.5秒后再显示结果
          setTimeout(() => {
            const finalAngle = Math.abs(targetAngle % 360);
            const resultIndex = Math.floor(finalAngle / (360 / this.data.options.length)) % this.data.options.length;
            this.setData({
              result: this.data.options[resultIndex]
            });
            callback();
          }, 3500); // 延迟3500ms（3.5秒）
        });
      }
    };

    animate();
  },

  // 编辑选项
  editOptions() {
    wx.navigateTo({
      url: '/pages/edit/edit'
    });
  }
});
