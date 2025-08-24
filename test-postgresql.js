// PostgreSQL API测试脚本
const testPostgreSQLAPI = async () => {
  const baseURL = 'http://localhost:3000';
  
  console.log('🐘 开始测试 PostgreSQL API');
  console.log('=====================================');
  
  try {
    // 1. 测试服务器状态
    console.log('\n1. 测试服务器状态:');
    let response = await fetch(`${baseURL}/`);
    let data = await response.json();
    console.log('✅ 服务器状态:', data);
    
    // 2. 获取统计信息
    console.log('\n2. 获取统计信息:');
    response = await fetch(`${baseURL}/api/todos/stats/summary`);
    data = await response.json();
    console.log('✅ 统计信息:', data);
    
    // 3. 获取所有待办事项（带分页）
    console.log('\n3. 获取所有待办事项:');
    response = await fetch(`${baseURL}/api/todos?page=1&limit=5`);
    data = await response.json();
    console.log('✅ 待办事项列表:', data);
    
    // 4. 创建新的待办事项（带优先级）
    console.log('\n4. 创建高优先级待办事项:');
    response = await fetch(`${baseURL}/api/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: '学习PostgreSQL与Sequelize',
        description: '掌握PostgreSQL数据库操作和Sequelize ORM',
        priority: 'high',
        dueDate: '2025-08-30'
      })
    });
    data = await response.json();
    console.log('✅ 创建结果:', data);
    
    const newTodoId = data.todo?.id;
    
    if (newTodoId) {
      // 5. 搜索待办事项
      console.log('\n5. 搜索待办事项:');
      response = await fetch(`${baseURL}/api/todos?search=PostgreSQL`);
      data = await response.json();
      console.log('✅ 搜索结果:', data);
      
      // 6. 按优先级过滤
      console.log('\n6. 获取高优先级待办事项:');
      response = await fetch(`${baseURL}/api/todos?priority=high`);
      data = await response.json();
      console.log('✅ 高优先级事项:', data);
      
      // 7. 更新待办事项
      console.log('\n7. 更新待办事项:');
      response = await fetch(`${baseURL}/api/todos/${newTodoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: true,
          description: '已完成PostgreSQL数据库操作和Sequelize ORM学习'
        })
      });
      data = await response.json();
      console.log('✅ 更新结果:', data);
      
      // 8. 批量操作测试
      console.log('\n8. 测试批量完成操作:');
      response = await fetch(`${baseURL}/api/todos/batch`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'complete',
          ids: [1, 2]
        })
      });
      data = await response.json();
      console.log('✅ 批量操作结果:', data);
    }
    
    // 9. 最终统计信息
    console.log('\n9. 最终统计信息:');
    response = await fetch(`${baseURL}/api/todos/stats/summary`);
    data = await response.json();
    console.log('✅ 最终统计:', data);
    
    console.log('\n🎉 PostgreSQL API测试完成！');
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
  }
};

// 运行测试
testPostgreSQLAPI();
