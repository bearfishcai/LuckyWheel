Page({
  data: {
    todos: [],
    newTodo: '',
    selectedColor: '#ffffff',
    selectedTime: '',
    colorIndex: 0,
    colors: [
      '#ffffff', // 白色
      '#ffcccc', // 浅粉
      '#ccffcc', // 浅绿
      '#ccccff', // 浅蓝
      '#ffffcc', // 浅黄
      '#ffcc99', // 橙色
      '#ff99cc', // 粉色
      '#99ccff', // 蓝色
      '#99ff99', // 绿色
      '#ff9999'  // 红色
    ]
  },

  onLoad() {
    // 延迟初始化数据
    setTimeout(() => {
      const todos = wx.getStorageSync('todos') || []
      this.setData({ todos })
    }, 300)
  },

  onInput(e) {
    this.setData({
      newTodo: e.detail.value
    })
  },

  addTodo() {
    if (!this.data.newTodo.trim()) {
      wx.showToast({
        title: '请输入待办事项',
        icon: 'none'
      });
      return;
    }

    const now = new Date();
    const currentTime = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const currentDate = now.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });

    const todos = this.data.todos;
    todos.push({
      text: this.data.newTodo,
      time: this.data.selectedTime || `${currentDate} ${currentTime}`,
      color: this.data.selectedColor,
      completed: false
    });
    
    this.setData({
      todos: todos,
      newTodo: '',
      selectedTime: ''
    });
    
    // 保存到本地存储
    wx.setStorage({
      key: 'todos',
      data: todos
    });
  },

  removeTodo(e) {
    const index = e.currentTarget.dataset.index
    const todos = this.data.todos.filter((_, i) => i !== index)
    this.setData({ todos })
    wx.setStorageSync('todos', todos)
  },

  onColorChange(e) {
    const index = e.detail.value
    this.setData({
      colorIndex: index,
      selectedColor: this.data.colors[index]
    })
  },

  setTime(e) {
    this.setData({
      selectedTime: e.detail.value
    })
  },

  toggleComplete(e) {
    const index = e.currentTarget.dataset.index;
    const todos = this.data.todos;
    todos[index].completed = !todos[index].completed;
    
    this.setData({
      todos: todos
    });
    
    // 保存到本地存储
    wx.setStorage({
      key: 'todos',
      data: todos
    });
  },

  deleteTodo(e) {
    const index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个待办事项吗？',
      success: (res) => {
        if (res.confirm) {
          const todos = this.data.todos;
          todos.splice(index, 1);
          
          this.setData({
            todos: todos
          });
          
          // 保存到本地存储
          wx.setStorage({
            key: 'todos',
            data: todos
          });

          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  }
})
