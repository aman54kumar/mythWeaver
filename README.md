# 🌟 MythWeaver
*Weaving ancient myths into modern stories*

> Transform your modern stories into ancient myths with the power of AI

MythWeaver is a production-ready web application that converts contemporary scenarios into beautifully crafted ancient myths, complete with interactive endings and cultural wisdom. Built with respect for traditional storytelling and powered by OpenAI's advanced language models.

![MythWeaver Hero](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688) ![React](https://img.shields.io/badge/React-18.2-61DAFB) ![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

## ✨ Features

- **AI-Powered Storytelling**: Transform any modern scenario into an authentic ancient myth
- **Cultural Respect**: Choose from 9+ cultural traditions with authentic motifs from public domain sources
- **Interactive Endings**: Every myth comes with 3 choice-driven outcomes
- **Beautiful UI**: Immersive design with animations, starfield backgrounds, and ancient aesthetics
- **Production Ready**: Docker containerization, CI/CD, monitoring, and security built-in
- **SEO Optimized**: Social sharing, meta tags, and search engine friendly
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Mobile First**: Responsive design that works perfectly on all devices

## 🏛️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  FastAPI Backend │    │   OpenAI API    │
│                 │◄──►│                 │◄──►│                 │
│  • Tailwind CSS │    │  • Rate Limiting │    │  • GPT-4o-mini  │
│  • Framer Motion│    │  • Content Safety│    │  • Moderation   │
│  • Vite Build   │    │  • Caching      │    │  • JSON Mode    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       
         │              ┌─────────────────┐             
         │              │  Redis Cache    │             
         │              │  • Response Cache│             
         └──────────────┤  • Rate Limiting│             
                        └─────────────────┘             
```

### Tech Stack

**Frontend:**
- React 18 with Vite for blazing fast development and builds
- Tailwind CSS for utility-first styling with custom mythic theme
- Framer Motion for smooth animations and page transitions
- Axios for API communication with interceptors
- React Router for client-side routing

**Backend:**
- FastAPI with Python 3.11+ for high-performance async API
- OpenAI Python SDK for myth generation
- SQLite/PostgreSQL for story metadata storage
- Redis for caching and rate limiting
- Pydantic for data validation and serialization

**Infrastructure:**
- Docker & Docker Compose for containerization
- GitHub Actions for CI/CD pipeline
- Nginx for reverse proxy and static file serving
- Health checks and monitoring ready
- Sentry integration for error tracking

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- OpenAI API key
- Node.js 18+ and Python 3.11+ (for development)

### 1. Clone the Repository

```bash
git clone https://github.com/mythosync/mythosync.git
cd mythosync
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit with your OpenAI API key
nano .env
```

**Required Environment Variables:**
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini
```

### 3. Run with Docker

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/v1/health

## 🛠️ Development Setup

### Backend Development

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running Tests

```bash
# Backend tests
cd backend
pytest tests/ -v --cov=app

# Frontend tests
cd frontend
npm run test
```

## 🐳 Docker Commands

```bash
# Development with hot reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production build
docker-compose --profile production up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Scale services
docker-compose up --scale backend=3

# Health check
docker-compose ps
```

## 🌐 Deployment

### Option 1: VPS/Server Deployment

```bash
# On your server
git clone https://github.com/mythosync/mythosync.git
cd mythosync

# Set environment variables
cp env.example .env
nano .env

# Deploy with SSL
docker-compose --profile production up -d

# Setup SSL with Let's Encrypt
sudo certbot --nginx -d mythweaver.fun -d www.mythweaver.fun
```

### Option 2: Cloud Deployment

**Render (Recommended)**
1. Fork this repository
2. Connect to Render
3. Set environment variables in Render dashboard
4. Deploy with one click

**Vercel + Railway**
- Frontend: Deploy to Vercel
- Backend: Deploy to Railway
- Configure environment variables

### Environment Variables for Production

```env
# Core Configuration
OPENAI_API_KEY=your-production-api-key
ENVIRONMENT=production
ALLOWED_ORIGINS=https://mythweaver.fun,https://www.mythweaver.fun

# Security
SENTRY_DSN=your-sentry-dsn
RATE_LIMIT_REQUESTS=20
USE_OPENAI_MODERATION=true

# Database (for PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:5432/mythosync

# Optional: Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXX
```

## 📊 API Documentation

### Generate Myth Endpoint

```http
POST /api/v1/generate-myth
Content-Type: application/json

{
  "scenario": "I'm starting a sustainable energy company...",
  "culture": "greek",
  "tone": "balanced"
}
```

**Response:**
```json
{
  "title": "The Skylark and the Iron Wind",
  "adapted_story": "In times long past, when the world was young...",
  "choices": [
    {
      "id": "c1",
      "label": "Seek Wisdom",
      "outcome": "The protagonist seeks counsel..."
    }
  ],
  "meta": {
    "culture": "greek",
    "source_motif": "Hero's journey with divine aid",
    "generation_time": 2.1,
    "model_used": "gpt-4o-mini"
  }
}
```

### Supported Cultures

- `auto` - Auto-detect from scenario
- `greek` - Greek mythology
- `norse` - Norse/Viking traditions
- `indian` - Indian/Hindu traditions
- `japanese` - Japanese folklore
- `egyptian` - Ancient Egyptian
- `celtic` - Celtic/Irish traditions
- `chinese` - Chinese mythology
- `african` - African folklore
- `native_american` - Native American traditions

## 🎨 Customization

### Theming

The app uses a custom Tailwind theme with mythic colors:

```js
// tailwind.config.js
colors: {
  midnight: '#0b1020',     // Dark background
  gold: '#c59b45',         // Accent color
  parchment: '#f6edd9',    // Text color
  crimson: '#8b2a2a',      // Error/warning
}
```

### Adding New Cultures

1. Add culture keywords to `backend/app/services/myth_utils.py`
2. Add motifs to `backend/app/db/seed_myths.json`
3. Update frontend culture dropdown in `frontend/src/pages/InputPage.jsx`

### Custom Animations

Framer Motion animations are defined in components. Modify `initial`, `animate`, and `transition` props:

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
```

## 🔒 Security Features

- **Content Moderation**: OpenAI moderation API integration
- **Rate Limiting**: IP-based request throttling
- **Input Sanitization**: XSS and injection prevention
- **CORS Configuration**: Secure cross-origin requests
- **Environment Variables**: No secrets in code
- **Health Checks**: Monitoring and alerting ready

## 📈 Monitoring & Analytics

### Built-in Monitoring

- Health check endpoints
- Structured JSON logging
- Request/response metrics
- Error tracking with Sentry

### Analytics Setup

```env
# Google Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXX

# Privacy-friendly alternative
PLAUSIBLE_DOMAIN=mythweaver.fun
```

## 🧪 Testing

```bash
# Run all tests
npm run test:all

# Backend tests with coverage
cd backend && pytest --cov=app --cov-report=html

# Frontend tests with UI
cd frontend && npm run test:ui

# E2E tests
npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow existing code style (Black for Python, Prettier for JS)
- Add tests for new features
- Update documentation
- Respect cultural traditions in myth generation

## 🎯 Roadmap

- [ ] **Phase 1**: Core myth generation (✅ Complete)
- [ ] **Phase 2**: User accounts and saved stories
- [ ] **Phase 3**: Community sharing and ratings
- [ ] **Phase 4**: Audio narration with TTS
- [ ] **Phase 5**: Mobile app development
- [ ] **Phase 6**: Educational partnerships

## 📜 Cultural Respect & Ethics

MythWeaver is built with deep respect for cultural traditions:

- Only uses public domain sources (Project Gutenberg, Sacred Texts)
- Avoids sacred or sensitive cultural elements
- Includes proper attribution and cultural context
- Community feedback encouraged for cultural accuracy

## 🐛 Troubleshooting

### Common Issues

**OpenAI API Errors**
```bash
# Check API key
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
```

**Docker Issues**
```bash
# Reset containers
docker-compose down -v
docker-compose up --build

# Check logs
docker-compose logs backend
```

**Frontend Build Errors**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for powerful language models
- [Project Gutenberg](https://gutenberg.org) for public domain texts
- [Sacred Texts](https://sacred-texts.com) for cultural resources
- All the storytellers who preserve ancient wisdom

## 📧 Contact

- **Website**: https://mythweaver.fun
- **Email**: contact@mythweaver.fun
- **GitHub**: https://github.com/mythosync/mythosync
- **Issues**: https://github.com/mythosync/mythosync/issues

---

**Made with ❤️ for storytellers worldwide**

*Transform your story. Honor the past. Inspire the future.*
#   T r i g g e r   R e n d e r   r e b u i l d  
 