// API测试脚本
const testAPI = async () => {
  const baseURL = 'http://localhost:3000';
  
  console.log('🚀 开始测试 Do_After API');
  console.log('=====================================');
  
  try {
    // 1. 测试服务器状态
    console.log('\n1. 测试服务器状态:');
    let response = await fetch(`${baseURL}/`);
    let data = await response.json();
    console.log('✅ 服务器状态:', data);
    
    // 2. 获取所有待办事项
    console.log('\n2. 获取所有待办事项:');
    response = await fetch(`${baseURL}/api/todos`);
    data = await response.json();
    console.log('✅ 待办事项列表:', data);
    
    // 3. 创建新的待办事项
    console.log('\n3. 创建新的待办事项:');
    response = await fetch(`${baseURL}/api/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: '学习Node.js',
        description: '完成Express REST API开发'
      })
    });
    data = await response.json();
    console.log('✅ 创建结果:', data);
    
    const newTodoId = data.todo?.id;
    
    if (newTodoId) {
      // 4. 获取单个待办事项
      console.log('\n4. 获取单个待办事项:');
      response = await fetch(`${baseURL}/api/todos/${newTodoId}`);
      data = await response.json();
      console.log('✅ 获取结果:', data);
      
      // 5. 更新待办事项
      console.log('\n5. 更新待办事项:');
      response = await fetch(`${baseURL}/api/todos/${newTodoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '学习Node.js (已更新)',
          description: '完成Express REST API开发和测试',
          completed: true
        })
      });
      data = await response.json();
      console.log('✅ 更新结果:', data);
      
      // 6. 再次获取所有待办事项查看更新结果
      console.log('\n6. 查看更新后的所有待办事项:');
      response = await fetch(`${baseURL}/api/todos`);
      data = await response.json();
      console.log('✅ 更新后的列表:', data);
    }
    
    console.log('\n🎉 API测试完成！');
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
  }
};

// 运行测试
testAPI();
