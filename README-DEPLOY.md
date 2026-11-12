# 🚀 AWS Single-Command Deployment Guide

This project is configured with a fully automated, production-ready Docker Compose & Nginx setup configured for the custom domain **`lotushut.bluewebspark.com`**. You can deploy the entire stack (Database, Backend, Admin Panel, Customer Website, and Nginx reverse proxy) to any AWS EC2 instance with a **single command**.

---

## 📋 Prerequisites on AWS
1. Launch an **AWS EC2 Instance**:
   - **AMI**: Ubuntu 22.04 LTS or 24.04 LTS (Recommended)
   - **Instance Type**: `t3.small` or `t3.medium` (Minimum 2 GB RAM recommended for Next.js build)
   - **Security Group (Inbound rules)**:
     - Port `22` (SSH)
     - Port `80` (HTTP)
     - Port `443` (HTTPS)
2. **DNS Configuration**:
   - Point an **A Record** for `lotushut.bluewebspark.com` to your AWS EC2 Public IPv4 Address in your DNS provider (e.g. Cloudflare, Route53, GoDaddy).

---

## ⚡ Deployment Instructions (One Command)

### Step 1: Connect to your EC2 Instance
```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### Step 2: Upload/Clone your project
```bash
git clone <your-repository-url> app
cd app
```
*(Or if already cloned, run: `git pull`)*

### Step 3: Run the Single Deployment Command
```bash
bash deploy.sh
```

---

## 🌐 Application Access Endpoints
- 🌐 **Customer Website**: `https://lotushut.bluewebspark.com/` (or `http://lotushut.bluewebspark.com/`)
- ⚙️ **Admin Dashboard**: `https://lotushut.bluewebspark.com/admin/`
- 📡 **Backend REST API**: `https://lotushut.bluewebspark.com/api/`
- 🔌 **Real-time WebSockets**: `https://lotushut.bluewebspark.com/socket.io/`

---

## 🔑 Default Admin Login
- **URL**: `https://lotushut.bluewebspark.com/admin/`
- **Email**: `admin@restaurant.com`
- **Password**: `Admin@123456`

---

## 📊 Useful Docker Commands on the Server
- Sync Menu Items from Image:
  ```bash
  sudo ./sync-menu.sh
  ```
- View live logs:
  ```bash
  docker compose logs -f
  ```
- Check container status:
  ```bash
  docker compose ps
  ```
- Restart all services:
  ```bash
  docker compose restart
  ```
- Stop everything:
  ```bash
  docker compose down
  ```
