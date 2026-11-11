# 🚀 AWS Single-Command Deployment Guide

This project is configured with a fully automated, production-ready Docker Compose & Nginx setup. You can deploy the entire stack (Database, Backend, Admin Panel, Customer Website, and Nginx reverse proxy) to any AWS EC2 instance with a **single command**.

---

## 📋 Prerequisites on AWS
1. Launch an **AWS EC2 Instance**:
   - **AMI**: Ubuntu 22.04 LTS or 24.04 LTS (Recommended)
   - **Instance Type**: `t3.small` or `t3.medium` (Minimum 2 GB RAM recommended for Next.js build)
   - **Security Group (Inbound rules)**:
     - Port `22` (SSH)
     - Port `80` (HTTP)
     - Port `443` (HTTPS)

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
*(Or upload this project folder to your EC2 instance)*

### Step 3: Run the Single Deployment Command
```bash
bash deploy.sh
```

---

## 🛠️ What `deploy.sh` Does Automatically:
1. **Installs Docker & Docker Compose** if not already installed.
2. **Generates a secure `.env` file** with randomized passwords, JWT access & refresh secrets, and cookie secrets.
3. **Creates & Configures PostgreSQL 16**: Sets up persistent storage and a healthcheck.
4. **Builds all applications**:
   - **Backend**: Compiles TypeScript, runs migrations (`db:migrate`) and initial seeds (`db:seed:all`) automatically.
   - **Admin Dashboard**: Multi-stage build with Vite and internal routing.
   - **Customer Website**: Production standalone build with Next.js.
5. **Configures Nginx Reverse Proxy**:
   - `http://<your-ec2-ip>/` ➡️ **Customer Website**
   - `http://<your-ec2-ip>/admin/` ➡️ **Admin Panel Dashboard**
   - `http://<your-ec2-ip>/api/` ➡️ **Backend REST APIs**
   - `http://<your-ec2-ip>/socket.io/` ➡️ **Real-time WebSockets**

---

## 🔑 Default Admin Login
- **URL**: `http://<your-ec2-ip>/admin/`
- **Email**: `admin@restaurant.com`
- **Password**: `Admin@123456`

---

## 📊 Useful Docker Commands on the Server
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
