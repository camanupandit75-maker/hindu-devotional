# DevotionalAI - Quick Start Guide

## 🚀 Getting Started

### Start Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### Build for Production
```bash
npm run build
npm start
```

## 📱 Available Pages

1. **Landing Page** (`/`) - Hero section, features, how it works, pricing preview
2. **Login** (`/auth/login`) - User authentication
3. **Register** (`/auth/register`) - New user registration
4. **Dashboard** (`/dashboard`) - Stats, quick actions, recent generations
5. **Generate** (`/generate`) - 4-step mantra generation form
6. **Templates** (`/templates`) - Browse and filter video templates
7. **Pricing** (`/pricing`) - 3-tier pricing plans with comparison
8. **Account** (`/account`) - Profile, subscription, usage, settings
9. **Generation Details** (`/generation/[id]`) - View and download generated content

## 🎨 Design Features

- **Devotional Color Palette**: Orange (#FF7612), Green (#138808), Gold (#FFD700)
- **Devanagari Font Support**: Noto Sans Devanagari for Sanskrit text
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Animations**: Smooth transitions with Framer Motion
- **Glassmorphism Effects**: Modern UI with backdrop blur

## 🛠️ Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Shadcn/ui Components
- Framer Motion
- Lucide React Icons

## 📝 Mock Data

All pages use comprehensive mock data from `lib/mock-data.ts`:
- User profiles with subscriptions
- Generation history
- Template library
- Pricing plans

## 🔧 Troubleshooting

If you encounter build errors:
```bash
rm -rf .next
npm run dev
```

If you see module errors:
```bash
rm -rf node_modules .next
npm install
npm run dev
```

## ✨ Next Steps

To integrate with a backend:
1. Replace mock data in `lib/mock-data.ts` with API calls
2. Add authentication logic in auth pages
3. Implement file upload/download functionality
4. Connect to your backend API endpoints

---

**Status**: ✅ Build verified and working!
**Last Updated**: All pages and components complete

