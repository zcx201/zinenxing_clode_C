<?xml version="1.0" encoding="UTF-8"?>
<map version="0.9.0">
  <node TEXT="Admin 控制台">
    <node TEXT="仪表盘 (Dashboard)">
      <node TEXT="KPI 总览 (用户/DAU/MAU/留存/自选数/消息量)"/>
      <node TEXT="系统健康 (CPU/内存/队列/失败任务)"/>
      <node TEXT="实时告警 & 快速操作 (触发任务/重跑 job)"/>
    </node>

    <node TEXT="用户管理 (Users)">
      <node TEXT="列表 / 搜索 / 筛选 (状态/角色/活跃度/最后登录)"/>
      <node TEXT="用户详情 (Profile, 活动流, 收藏, 自选, 举报记录)"/>
      <node TEXT="操作: 禁用/解禁/重置密码/分配角色/导出/批量操作"/>
      <node TEXT="接口 & 数据模型 (GET /admin/users, users 表等)"/>
    </node>

    <node TEXT="权限与角色管理 (RBAC)">
      <node TEXT="角色管理 (创建/编辑/删除)"/>
      <node TEXT="权限分配 (role -> permissions)"/>
      <node TEXT="用户角色映射"/>
      <node TEXT="权限点：superadmin/admin.user_manage 等"/>
    </node>

    <node TEXT="内容管理 (CMS)">
      <node TEXT="新闻 / 文章 (CRUD, 定时发布, 标签, 图片)"/>
      <node TEXT="AI 推荐 (AIPicks: 审阅, 手动调整, A/B 测试)"/>
      <node TEXT="市场/股票数据 (stocks 管理, 导入/导出, 行业分类)"/>
      <node TEXT="评论 / 举报 处理 (内容审计队列)"/>
      <node TEXT="AI 模型管理 (ModelOps)">
        <node TEXT="模型仓库: 版本/元数据/标签"/>
        <node TEXT="训练任务管理 (触发/资源/日志)"/>
        <node TEXT="评估与验证 (指标/回归测试/对比实验)"/>
        <node TEXT="部署与发布 (线上/离线/A/B 测试)"/>
        <node TEXT="数据集与标注管理 (数据来源/样本审查)"/>
        <node TEXT="权限与审计 (谁修改/谁部署/变更历史)"/>
      </node>
    </node>

    <node TEXT="自选嗨吧 & 收藏管理 (Favorites)">
      <node TEXT="按用户/按股票查看自选"/>
      <node TEXT="移除 / 批量操作 / 导入导出"/>
      <node TEXT="审计: 谁在何时加入/删除"/>
    </node>

    <node TEXT="群组与社交 (Groups / Friends / Messages)">
      <node TEXT="群组管理 (成员管理, 解散, 权限)"/>
      <node TEXT="查看群消息 / 搜索 / 举报处理"/>
      <node TEXT="私信/群消息审计"/>
    </node>

    <node TEXT="互动 / 评论 / 举报 (Interaction)">
      <node TEXT="评论列表 / 删除 / 批量处理"/>
      <node TEXT="举报工单 (查看/处理/关闭)"/>
      <node TEXT="聊天记录回放 (按用户/按群/关键词)"/>
    </node>

    <node TEXT="通知与消息 (Notifications)">
      <node TEXT="模板管理 (邮件/SMS/推送)"/>
      <node TEXT="发送历史 / 重试队列"/>
      <node TEXT="手动发送 / 规则触发配置"/>
    </node>

    <node TEXT="数据与统计 (Analytics)">
      <node TEXT="用户增长 / 漏斗 / 留存 / 活跃曲线"/>
      <node TEXT="自选增长曲线 / 消息量统计"/>
      <node TEXT="导出图表 / CSV, 支持自定义时间范围"/>
      <node TEXT="数据来源: 事件总线 / ETL -> OLAP (建议)"/>
    </node>

    <node TEXT="审计日志 (Audit)">
      <node TEXT="记录管理员后台的变更操作 (谁/何时/何改)"/>
      <node TEXT="接口: GET /admin/audit"/>
      <node TEXT="合规: 数据保留策略 / 导出 / 隐私处理"/>
    </node>

    <node TEXT="系统设置 (System Settings)">
      <node TEXT="站点参数 / 维护模式"/>
      <node TEXT="第三方 API Keys (短信/邮件/行情)"/>
      <node TEXT="Feature flags / 开关管理"/>
    </node>

    <node TEXT="迁移与数据导入 (Migration)">
      <node TEXT="上传 SQL/CSV/JSON, 执行与回滚"/>
      <node TEXT="迁移历史与审计"/>
    </node>

    <node TEXT="运维与监控 (Ops)">
      <node TEXT="任务队列 & 后台 Job (队列长度/失败任务/重试)"/>
      <node TEXT="服务健康 / 日志流 / 错误跟踪 (Sentry / ELK)"/>
      <node TEXT="手动触发任务 (抓取行情, 重跑 ETL)"/>
      <node TEXT="实时市场数据接入 (行情接入)">
        <node TEXT="接入来源: 第三方数据商 / 内部直连"/>
        <node TEXT="接入策略: 实时/近实时/批量/回溯"/>
        <node TEXT="数据质量与监控 (延迟/丢包/异常点)"/>
        <node TEXT="密钥管理与限流 (API Key, 流量控制)"/>
        <node TEXT="入库与归档: OLTP -> OLAP, 回放能力"/>
      </node>
    </node>

    <node TEXT="安全 (Security)">
      <node TEXT="登录策略 / 异常登录监控"/>
      <node TEXT="IP 黑名单 / 设备绑定"/>
      <node TEXT="敏感操作二次确认与审计"/>
    </node>

    <node TEXT="媒体/资产管理 (Assets)">
      <node TEXT="图片/附件 浏览 / 上传 / 删除"/>
      <node TEXT="CDN 签名上传 / 到期清理"/>
    </node>

    <node TEXT="导出 / 备份">
      <node TEXT="手动 DB 导出 / 自动备份计划"/>
      <node TEXT="导出报表 CSV / JSON"/>
    </node>

    <node TEXT="帮助与文档 (Docs / Support)">
      <node TEXT="后台使用说明 / 权限说明"/>
      <node TEXT="常见问题与管理员手册"/>
    </node>

    <node TEXT="开发/部署 建议">
      <node TEXT="后端: Node.js(Nest/Express) or Python(FastAPI), PostgreSQL, Redis"/>
      <node TEXT="前端: React + Ant Design (或现有 Tailwind)"/>
      <node TEXT="监控: Sentry, Prometheus+Grafana, ELK"/>
      <node TEXT="事件流: Kafka 或 Redis Streams (用于统计/ETL)"/>
    </node>

    <node TEXT="MVP 优先级 (2 周内)"/>
    <node TEXT="下一步交付项">
      <node TEXT="OpenAPI 草案 (用户/内容/任务 接口)"/>
      <node TEXT="数据库表草案 (DDL)"/>
      <node TEXT="Admin React 路由与页面骨架"/>
    </node>
  </node>
</map>