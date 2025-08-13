# 🚀 MythWeaver Deployment Guide

This guide covers deploying MythWeaver to production with continuous deployment using GitHub Actions.

## 📋 Prerequisites

- GitHub repository
- Production server (VPS/Cloud instance)
- Domain name (optional, for HTTPS)
- OpenAI API key

## 🔧 Setup Instructions

### 1. GitHub Repository Setup

```bash
# Initialize git and add remote (replace with your repo URL)
git add .
git commit -m "Initial commit: MythWeaver application"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. GitHub Secrets Configuration

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add these secrets:

#### Required Secrets:
- `OPENAI_API_KEY` - Your OpenAI API key
- `PRODUCTION_HOST` - Your server IP address
- `PRODUCTION_USER` - SSH username (usually `ubuntu` or `root`)
- `PRODUCTION_SSH_KEY` - Your private SSH key for server access

#### Optional Secrets:
- `OPENAI_API_KEY_TEST` - Separate API key for testing (or same as main)
- `SENTRY_DSN` - For error monitoring
- `SLACK_WEBHOOK_URL` - For deployment notifications
- `PRODUCTION_PORT` - SSH port (default: 22)

### 3. Production Server Setup

#### 3.1 Initial Server Configuration

```bash
# Connect to your server
ssh your-user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo apt install git -y

# Create application directory
sudo mkdir -p /opt/mythweaver
sudo chown $USER:$USER /opt/mythweaver

# Clone repository
cd /opt/mythweaver
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .
```

#### 3.2 Environment Configuration

```bash
# Create production environment file
cat > .env << EOF
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
ENVIRONMENT=production
SENTRY_DSN=your_sentry_dsn_here
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
DATABASE_URL=sqlite:///./data/app.db
REDIS_URL=redis://redis:6379/0
GITHUB_REPOSITORY_OWNER=YOUR_USERNAME
EOF
```

#### 3.3 Directory Structure

```bash
# Create necessary directories
mkdir -p backend/data
mkdir -p nginx/ssl
mkdir -p nginx/logs
mkdir -p /opt/backups/mythweaver

# Set permissions
sudo chown -R $USER:$USER /opt/mythweaver
chmod 755 scripts/deploy.sh
```

### 4. SSL Certificate Setup (Optional but Recommended)

#### Option A: Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot -y

# Get SSL certificate
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /opt/mythweaver/nginx/ssl/mythweaver.crt
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /opt/mythweaver/nginx/ssl/mythweaver.key
sudo chown $USER:$USER /opt/mythweaver/nginx/ssl/*
```

#### Option B: Self-Signed (Development)

```bash
# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/mythweaver.key \
    -out nginx/ssl/mythweaver.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=your-domain.com"
```

### 5. Initial Deployment

```bash
# First deployment
cd /opt/mythweaver
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Check deployment
docker-compose ps
docker-compose logs -f
```

### 6. Domain Configuration

#### 6.1 DNS Settings
Point your domain to your server IP:
- A record: `your-domain.com` → `your-server-ip`
- A record: `www.your-domain.com` → `your-server-ip`

#### 6.2 Update Nginx Configuration
Edit `nginx/nginx.conf` and replace `mythweaver.com` with your actual domain.

## 🔄 Continuous Deployment Workflow

The GitHub Actions workflow (`/.github/workflows/deploy.yml`) automatically:

1. **Tests** - Runs backend and frontend tests
2. **Builds** - Creates Docker images and pushes to GitHub Container Registry
3. **Deploys** - Updates production server with zero downtime
4. **Notifies** - Sends deployment status to Slack (if configured)

### Deployment Triggers

- **Automatic**: Push to `main` branch triggers full deployment
- **Manual**: Use GitHub Actions tab to manually trigger deployment
- **Rollback**: Use the deployment script for emergency rollback

## 🛠️ Management Commands

### Manual Deployment

```bash
# SSH to server and run
cd /opt/mythweaver
sudo ./scripts/deploy.sh deploy
```

### Health Check

```bash
# Check service health
sudo ./scripts/deploy.sh health

# Or check manually
curl http://localhost:8000/api/v1/health
curl http://localhost:3000/health
```

### Rollback

```bash
# Emergency rollback to previous version
sudo ./scripts/deploy.sh rollback
```

### View Logs

```bash
# Application logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Nginx logs
tail -f nginx/logs/access.log
tail -f nginx/logs/error.log

# Deployment logs
tail -f /var/log/mythweaver-deploy.log
```

### Database Management

```bash
# Backup database
cp backend/data/app.db /opt/backups/mythweaver/app_$(date +%Y%m%d_%H%M%S).db

# View database
docker-compose exec backend sqlite3 /app/data/app.db
```

## 🔒 Security Considerations

### Firewall Setup

```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Regular Maintenance

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Clean Docker resources
docker system prune -f

# Rotate logs
sudo logrotate -f /etc/logrotate.conf
```

## 📊 Monitoring

### Health Checks

The application includes built-in health endpoints:
- Backend: `GET /api/v1/health`
- Frontend: `GET /health`

### Log Monitoring

Key logs to monitor:
- Application errors in Docker logs
- Nginx access/error logs
- System logs for resource usage

### Alerts Setup

Configure monitoring tools like:
- **Uptime monitoring**: Pingdom, UptimeRobot
- **Error tracking**: Sentry (already integrated)
- **Log aggregation**: ELK stack, Fluentd
- **Metrics**: Prometheus + Grafana

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 80, 443, 3000, 8000 are available
2. **Permission errors**: Check file ownership and Docker group membership
3. **SSL issues**: Verify certificate paths and permissions
4. **API failures**: Check OpenAI API key and rate limits
5. **Build failures**: Verify GitHub secrets are properly set

### Debug Commands

```bash
# Check container status
docker-compose ps

# View detailed logs
docker-compose logs --details backend
docker-compose logs --details frontend

# Test API connectivity
curl -v http://localhost:8000/api/v1/health
curl -v http://localhost:3000/api/v1/health

# Check SSL certificate
openssl x509 -in nginx/ssl/mythweaver.crt -text -noout
```

## 📈 Scaling Considerations

For high-traffic scenarios:

1. **Load Balancing**: Use multiple backend instances
2. **Database**: Migrate from SQLite to PostgreSQL
3. **Caching**: Implement Redis caching for responses
4. **CDN**: Use CloudFlare or AWS CloudFront
5. **Container Orchestration**: Consider Kubernetes

## 🔄 Backup Strategy

Automated backups are created before each deployment:
- Database snapshots
- Environment configurations
- Application data

Backup retention: 10 most recent backups

---

## 🎯 Quick Start Summary

1. **Fork/Clone** this repository
2. **Configure GitHub secrets** with your server details and API keys
3. **Set up production server** with Docker and dependencies
4. **Push to main branch** - automatic deployment begins!
5. **Monitor deployment** in GitHub Actions tab
6. **Access your application** at your domain

Your MythWeaver application is now production-ready with continuous deployment! 🚀
