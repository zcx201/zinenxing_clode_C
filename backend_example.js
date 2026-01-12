// ============================================================================
// 后端示例 - 智能鑫AI API 服务
//
// 这是一个最小化的 Express.js 后端示例，展示如何：
// 1. 连接 PostgreSQL 数据库
// 2. 连接 Redis 缓存
// 3. 与前端通信
// 4. 提供健康检查端点
//
// 使用方式：
//   1. 将此文件放在 backend/ 目录下
//   2. 创建 backend/package.json（见下方）
//   3. docker-compose 会自动构建和运行
//
// ============================================================================

import express from 'express';
import cors from 'cors';
import pg from 'pg';
import redis from 'redis';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const app = express();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 【中间件】
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// CORS 配置（允许前端跨域访问）
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'http://zhinengxin-frontend:3001'  // Docker 内部
    : 'http://localhost:3001',             // 本地开发
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 【数据库连接】
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const pool = new pg.Pool({
  user: process.env.DB_USER || 'zhinengxin',
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'zhinengxin-database',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'zhinengxin_ai'
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

console.log(`✓ PostgreSQL 连接配置: ${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 【Redis 缓存连接】
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let redisClient;

(async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://:@zhinengxin-cache:6379',
      password: process.env.REDIS_PASSWORD,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      }
    });

    redisClient.on('error', (err) => {
      console.warn('⚠️  Redis 连接警告:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('✓ Redis 缓存已连接');
    });

    await redisClient.connect();
  } catch (err) {
    console.warn('⚠️  Redis 连接失败，继续运行但不使用缓存:', err.message);
  }
})();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 【API 路由】
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 【1】健康检查端点（用于 docker-compose healthcheck）
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 【2】就绪检查端点（检查数据库连接）
app.get('/api/ready', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    res.json({
      status: 'READY',
      database: 'connected',
      cache: redisClient ? 'connected' : 'unavailable'
    });
  } catch (err) {
    res.status(503).json({
      status: 'NOT_READY',
      database: 'disconnected',
      error: err.message
    });
  }
});

// 【3】获取所有用户（示例）
app.get('/api/users', async (req, res) => {
  try {
    // 先尝试从缓存获取
    if (redisClient) {
      const cached = await redisClient.get('users');
      if (cached) {
        console.log('📦 从缓存返回用户列表');
        return res.json(JSON.parse(cached));
      }
    }

    // 从数据库查询
    const result = await pool.query('SELECT * FROM users LIMIT 100');
    const users = result.rows;

    // 存储到缓存（1小时过期）
    if (redisClient && users.length > 0) {
      await redisClient.setEx('users', 3600, JSON.stringify(users));
    }

    res.json(users);
  } catch (err) {
    console.error('✗ 查询用户失败:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 【4】创建用户（示例）
app.post('/api/users', async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: '缺少必需字段' });
    }

    const result = await pool.query(
      'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *',
      [username, email]
    );

    // 清除缓存
    if (redisClient) {
      await redisClient.del('users');
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('✗ 创建用户失败:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 【5】获取指数数据（与前端聚宽 API 集成）
app.get('/api/indices/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;

    // 先尝试从缓存获取
    if (redisClient) {
      const cached = await redisClient.get(`index_${symbol}`);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    }

    // 这里应该调用聚宽 API 或从数据库查询
    // 示例：
    const indexData = {
      symbol,
      value: 3500.00 + Math.random() * 100,
      change: (Math.random() - 0.5) * 5,
      timestamp: new Date().toISOString()
    };

    // 缓存 5 分钟
    if (redisClient) {
      await redisClient.setEx(`index_${symbol}`, 300, JSON.stringify(indexData));
    }

    res.json(indexData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 【错误处理】
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '端点不存在' });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('✗ 错误:', err.message);
  res.status(500).json({ error: '内部服务器错误' });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 【启动服务器】
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PORT = process.env.API_PORT || 3000;
const HOST = process.env.API_HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🚀 智能鑫AI 后端服务已启动            ║
╠════════════════════════════════════════╣
║  地址: http://${HOST}:${PORT}
║  环境: ${process.env.NODE_ENV || 'development'}
║  日志级别: ${process.env.LOG_LEVEL || 'info'}
╠════════════════════════════════════════╣
║  数据库: ${process.env.DB_HOST}:${process.env.DB_PORT}
║  用户: ${process.env.DB_USER}
║  数据库名: ${process.env.DB_NAME}
╠════════════════════════════════════════╣
║  缓存: ${process.env.REDIS_URL}
╚════════════════════════════════════════╝
  `);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('📍 收到 SIGTERM，开始优雅关闭...');
  server.close(async () => {
    await pool.end();
    if (redisClient) {
      await redisClient.quit();
    }
    console.log('✓ 服务已安全关闭');
    process.exit(0);
  });
});

export default app;

// ============================================================================
// 【创建 backend/package.json】
// ============================================================================
// 
// {
//   "name": "zhinengxin-api",
//   "version": "1.0.0",
//   "type": "module",
//   "description": "智能鑫AI API 服务",
//   "main": "index.js",
//   "scripts": {
//     "start": "node dist/index.js",
//     "dev": "nodemon --exec node --experimental-modules dist/index.js",
//     "build": "npm run build:src",
//     "build:src": "echo 'Build complete'"
//   },
//   "dependencies": {
//     "express": "^4.18.2",
//     "cors": "^2.8.5",
//     "pg": "^8.10.0",
//     "redis": "^4.6.11",
//     "dotenv": "^16.3.1"
//   },
//   "devDependencies": {
//     "nodemon": "^3.0.1"
//   }
// }
//
// ============================================================================
