# Git 操作与 AWS EC2 部署说明

本文档适用于 Learning Resource Library（`taskmanager`）项目。项目采用 MERN 技术栈：React 前端、Node.js/Express 后端和 MongoDB 数据库。

## 1. Git 操作说明

### 1.1 仓库与分支规则

- GitHub 仓库：<https://github.com/fbyuanxx/taskmanager.git>
- `main`：稳定主分支，用于保存已经评审和合并的功能。
- 功能分支：使用 Jira 任务编号和简短功能名，例如：
  - `LEAR-5-signup`
  - `LEAR-14-login-logout`
  - `LEAR-20-add-resource`
  - `LEAR-42-admin-user-management`
- 提交信息：建议以 Jira 编号开头，例如 `LEAR-59 implement enable and disable user accounts`。

### 1.2 第一次下载项目

```bash
git clone https://github.com/fbyuanxx/taskmanager.git
cd taskmanager
git branch -a
```

### 1.3 开始开发新功能

先更新本地 `main`，再创建功能分支：

```bash
git switch main
git pull origin main
git switch -c LEAR-任务号-功能名称
```

例如：

```bash
git switch -c LEAR-70-ec2-deployment
```

### 1.4 查看和提交修改

```bash
git status
git diff
git add 文件名
git commit -m "LEAR-70 add EC2 deployment configuration"
```

确认所有相关改动后，也可以使用：

```bash
git add .
git commit -m "LEAR-70 complete EC2 deployment setup"
```

使用 `git add .` 前必须先运行 `git status`，避免提交 `.env`、依赖目录、构建缓存或其他无关文件。密码、JWT 密钥和 MongoDB 连接字符串不得提交到 Git。

### 1.5 推送分支并创建 Pull Request

```bash
git push -u origin LEAR-70-ec2-deployment
```

然后在 GitHub 中创建 Pull Request，目标分支选择 `main`。PR 描述应包含：

- 对应的 Jira Issue；
- 实现内容；
- 测试方法和测试结果；
- 已知限制；
- UI 改动截图（如适用）。

通过代码评审后将 PR 合并到 `main`。本项目历史中已采用功能分支 + Pull Request 的方式合并注册、登录、资源表单等功能。

### 1.6 合并后同步和清理分支

```bash
git switch main
git pull origin main
git branch -d LEAR-70-ec2-deployment
git push origin --delete LEAR-70-ec2-deployment
```

只有在确认分支已成功合并后才删除分支。

### 1.7 开发中同步 `main`

功能分支开发时间较长时：

```bash
git switch main
git pull origin main
git switch LEAR-70-ec2-deployment
git merge main
```

若发生冲突，打开冲突文件，处理 `<<<<<<<`、`=======`、`>>>>>>>` 标记，然后执行：

```bash
git add 冲突文件
git commit -m "LEAR-70 resolve merge conflicts with main"
```

### 1.8 常用检查和恢复命令

```bash
git status                         # 查看工作区状态
git log --oneline --graph --all    # 查看提交和分支历史
git diff                           # 查看未暂存修改
git diff --staged                  # 查看已暂存修改
git restore 文件名                 # 放弃某个未暂存文件的修改
git restore --staged 文件名        # 取消暂存，但保留文件修改
git stash push -m "说明"           # 临时保存未提交修改
git stash list                     # 查看暂存记录
git stash pop                      # 恢复最近一次暂存
```

不要在共享分支上使用 `git push --force`。不要使用 `git reset --hard`，除非已确认不需要保留本地修改。

## 2. AWS EC2 部署方案

推荐架构：

```text
浏览器 -> EC2 安全组 -> Nginx (80/443)
                         ├── React 静态文件
                         └── /api -> Express (localhost:5001) -> MongoDB Atlas
```

Nginx 对外提供网站并将 `/api` 请求转发到只在本机运行的 Express 服务。MongoDB 推荐使用 Atlas；EC2 上不必额外开放 5001 或 27017 端口。

### 2.1 部署前准备

需要：

- AWS 账号；
- MongoDB Atlas 数据库和连接字符串；
- 可选域名（没有域名也可先使用 EC2 公网 IP）；
- 已合并到 `main` 的项目代码；
- 一个新的强随机 `JWT_SECRET`。

部署前先调整 `frontend/src/axiosConfig.jsx`。由于前后端通过同一个 Nginx 地址访问，生产环境应使用相对地址：

```javascript
const axiosInstance = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});
```

这样 `/api/auth`、`/api/tasks` 等请求会自动发送到当前网站域名。项目当前已经采用这一配置；部署前仍应检查浏览器开发者工具，确认请求中没有 `localhost:5001` 或旧的公网 IP。

### 2.2 创建 EC2 实例

在 AWS Console 中创建实例：

1. AMI 选择 Ubuntu Server 22.04 LTS 或较新的 Ubuntu LTS。
2. 实例类型可使用 `t2.micro` 或 `t3.micro`（根据账号额度和实际负载选择）。
3. 创建并安全保存 SSH 密钥，例如 `taskmanager-key.pem`。
4. 建议分配 Elastic IP，避免实例重启后公网 IP 改变。
5. 安全组入站规则设置如下：

| 类型 | 端口 | 来源 | 用途 |
| --- | ---: | --- | --- |
| SSH | 22 | 管理员自己的公网 IP | 远程管理 |
| HTTP | 80 | `0.0.0.0/0`、`::/0` | 网站访问 |
| HTTPS | 443 | `0.0.0.0/0`、`::/0` | HTTPS 网站访问 |

不要向公网开放 5001 和 27017。

### 2.3 连接服务器

在本地终端执行：

```bash
chmod 400 taskmanager-key.pem
ssh -i taskmanager-key.pem ubuntu@EC2_PUBLIC_IP
```

### 2.4 安装运行环境

在 EC2 中执行：

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git nginx curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
node --version
npm --version
```

### 2.5 下载代码并安装依赖

```bash
cd /var/www
sudo git clone https://github.com/fbyuanxx/taskmanager.git
sudo chown -R ubuntu:ubuntu /var/www/taskmanager
cd /var/www/taskmanager
git switch main
npm run install-all
```

如果仓库是私有仓库，应使用 GitHub Deploy Key 或只读 Personal Access Token，不要把 Token 写入项目文件。

### 2.6 配置后端环境变量

创建 `/var/www/taskmanager/backend/.env`：

```bash
cd /var/www/taskmanager/backend
nano .env
```

写入：

```env
MONGO_URI=mongodb+srv://数据库用户:数据库密码@集群地址/learning-resource-library
JWT_SECRET=替换为足够长且随机的生产密钥
PORT=5001
```

保护该文件：

```bash
chmod 600 /var/www/taskmanager/backend/.env
```

MongoDB Atlas 的 Network Access 必须允许 EC2 访问。推荐将 EC2 的固定出口 IP 加入允许列表。课程演示若临时使用 `0.0.0.0/0`，必须使用强数据库密码，并在演示结束后收紧访问范围。

### 2.7 构建前端

```bash
cd /var/www/taskmanager
npm run build --prefix frontend
```

构建结果位于 `/var/www/taskmanager/frontend/build`。

### 2.8 使用 PM2 启动后端

```bash
cd /var/www/taskmanager/backend
pm2 start server.js --name taskmanager-api
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

`pm2 startup` 会输出一条需要使用 `sudo` 执行的命令。复制并执行该命令，再运行一次：

```bash
pm2 save
pm2 status
pm2 logs taskmanager-api
```

在服务器本机验证 API 已监听：

```bash
curl -i http://127.0.0.1:5001/api/auth/profile
```

返回 `401 Unauthorized` 也说明服务和路由已正常响应，因为该接口需要登录令牌。

### 2.9 配置 Nginx

创建配置文件：

```bash
sudo nano /etc/nginx/sites-available/taskmanager
```

填入以下内容，将 `YOUR_DOMAIN_OR_IP` 替换为域名或 EC2 公网 IP：

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name YOUR_DOMAIN_OR_IP;

    root /var/www/taskmanager/frontend/build;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

启用站点并检查配置：

```bash
sudo ln -s /etc/nginx/sites-available/taskmanager /etc/nginx/sites-enabled/taskmanager
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl enable nginx
```

然后访问 `http://EC2_PUBLIC_IP` 或绑定的域名。

### 2.10 配置 HTTPS（有域名时推荐）

先将域名的 A 记录指向 EC2 Elastic IP，再执行：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
sudo certbot renew --dry-run
```

Certbot 会自动申请证书并修改 Nginx 配置。HTTPS 生效后，应使用 `https://example.com` 访问系统。

## 3. 更新已部署版本

每次新的 PR 合并到 `main` 后，在 EC2 中执行：

```bash
cd /var/www/taskmanager
git status
git switch main
git pull --ff-only origin main
npm install --prefix backend
npm install --prefix frontend
npm run build --prefix frontend
pm2 restart taskmanager-api --update-env
sudo nginx -t
sudo systemctl reload nginx
```

部署服务器上不应直接修改项目源代码。`git status` 必须保持干净；如发现服务器存在本地修改，应先确认来源，不要直接覆盖。

## 4. 部署验证清单

部署完成后依次检查：

- 首页和注册页面可正常打开，刷新 React 子页面不会返回 404；
- 新用户可以注册、登录和退出；
- 登录状态在刷新后仍然保留；
- 用户可以新增、查看、修改和删除自己的任务；
- 用户可以查看和更新个人资料；
- 管理员可以查看用户并启用或禁用账户；
- 普通用户无法访问管理员接口；
- 浏览器开发者工具中没有指向 `localhost:5001` 的请求；
- `pm2 status` 显示 `taskmanager-api` 为 `online`；
- `sudo nginx -t` 返回配置成功；
- `.env` 未被 Git 跟踪，5001 和 27017 未向公网开放。

## 5. 常见问题排查

### 页面显示 502 Bad Gateway

后端没有运行或端口不一致：

```bash
pm2 status
pm2 logs taskmanager-api --lines 100
curl -i http://127.0.0.1:5001/api/auth/profile
```

### 后端无法连接 MongoDB

检查 `.env` 中的 `MONGO_URI`、数据库用户名和密码、Atlas IP 允许列表，以及密码中的特殊字符是否已进行 URL 编码。

### 前端仍请求 localhost

确认 `frontend/src/axiosConfig.jsx` 已改为相对地址，并重新构建：

```bash
cd /var/www/taskmanager
npm run build --prefix frontend
sudo systemctl reload nginx
```

### 刷新页面出现 404

确认 Nginx 的 `location /` 中包含：

```nginx
try_files $uri $uri/ /index.html;
```

### 查看服务日志

```bash
pm2 logs taskmanager-api
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 6. 安全与维护注意事项

- 不提交 `.env`、SSH 私钥、数据库密码、JWT 密钥或访问 Token；
- SSH 端口只允许管理员 IP，禁用不必要的公网端口；
- 使用普通 `ubuntu` 用户运行 Node.js，不使用 root 运行应用；
- 定期执行系统安全更新并检查 PM2、Nginx 和 MongoDB Atlas 日志；
- 生产环境使用 HTTPS、强密码和独立数据库用户；
- 为 MongoDB 配置备份或 Atlas 自动备份；
- 上线前运行前端和后端测试，并保存部署验证结果。
