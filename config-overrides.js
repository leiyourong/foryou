module.exports = function override(config, env) {
  // 如果是构建环境，确保输出目录可写
  if (env === 'production') {
    const path = require('path');
    const fs = require('fs');
    const buildPath = path.resolve(__dirname, 'build');
    
    // 尝试修复 build 目录权限
    try {
      if (fs.existsSync(buildPath)) {
        // 尝试删除旧的 build 目录
        const rimraf = require('rimraf');
        if (rimraf) {
          rimraf.sync(buildPath);
        }
      }
    } catch (e) {
      // 忽略错误，继续构建
    }
  }
  
  return config;
};