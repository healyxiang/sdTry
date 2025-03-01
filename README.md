## 本地开发

### 环境变量

```
.env.local
<!-- 数据库 -->
DATABASE_URL=
<!-- github 登录 -->
GITHUB_ID=
GITHUB_SECRET=
GITHUB_CALLBACK_URL=
<!-- nextauth 登录 -->
NEXTAUTH_SECRET=
<!-- rabbitmq -->
RABBITMQ_URL=
<!-- 环境变量 -->
ENVIRONMENT=local
```

## 数据库部分

```
npx prisma migrate dev --name init_test // 根据 prisma model 生成sql，操作远程数据库，生成表
npx prisma generate // 生成prisma 客户端
```
