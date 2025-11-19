# DevotionalAI - AI-Powered Hindu Devotional Content Platform

A complete Next.js 14 application for generating Sanskrit mantras with text-to-speech and creating devotional lyric videos.

## Features

- 🎙️ **Sanskrit TTS**: High-quality text-to-speech for Sanskrit mantras with authentic pronunciation
- 🎬 **Lyric Videos**: Create stunning devotional lyric videos with beautiful templates
- 🌍 **Multiple Languages**: Support for Sanskrit, Hindi, Tamil, Telugu, and more
- 🎨 **Beautiful Templates**: Extensive library of devotional video templates
- 📊 **Dashboard**: Track your generations and usage statistics
- 💳 **Flexible Pricing**: Free, Creator, and Pro plans to suit your needs

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom devotional color palette
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Hooks and Context API
- **Fonts**: Inter + Noto Sans Devanagari for Sanskrit text

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js 14 App Router pages
│   ├── (auth)/             # Authentication pages
│   ├── dashboard/          # Dashboard page
│   ├── generate/           # Generation page
│   ├── templates/          # Templates page
│   ├── pricing/            # Pricing page
│   ├── account/             # Account settings
│   └── generation/[id]/    # Generation details
├── components/             # React components
│   ├── ui/                 # Shadcn/ui base components
│   └── ...                 # Custom components
├── lib/                    # Utilities and mock data
├── types/                  # TypeScript type definitions
└── styles/                 # Global styles

```

## Design System

### Color Palette

- **Primary (Devotional Orange)**: #FF7612
- **Secondary (Sacred Green)**: #138808
- **Accent (Golden)**: #FFD700
- **Background**: #FFF8F0 (warm ivory)
- **Text Primary**: #2D1810 (dark brown)
- **Text Secondary**: #6B4423 (medium brown)

### Typography

- **Sans**: Inter (for UI text)
- **Devanagari**: Noto Sans Devanagari (for Sanskrit text)

## Pages

- `/` - Landing page with features and pricing preview
- `/auth/login` - User login
- `/auth/register` - User registration
- `/dashboard` - Main dashboard with stats and recent generations
- `/generate` - Multi-step mantra generation form
- `/templates` - Browse and filter video templates
- `/pricing` - Pricing plans and comparison
- `/account` - Account settings (Profile, Subscription, Usage, Settings)
- `/generation/[id]` - Generation details with audio/video preview

## Mock Data

The application includes comprehensive mock data for demonstration:
- User profiles with subscription details
- Generation history with various statuses
- Template library with categories
- Pricing plans and features

## Features in Detail

### Generation Flow

1. **Enter Mantra**: Type or paste Sanskrit text
2. **Select Language**: Choose from Sanskrit, Hindi, Tamil, Telugu
3. **Choose Voice Style**: Devotional, Meditative, or Energetic
4. **Pick Voice**: Select from available voices matching the style
5. **Generate**: Create audio and video content

### Templates

- Filterable by category (Temple, Nature, Abstract, Festive)
- Search functionality
- Premium badge system
- Preview modal with customization options

### Dashboard

- Usage statistics
- Recent generations
- Quick actions
- Subscription status

## Development

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Modular component architecture
- Reusable UI components

### Accessibility

- ARIA labels for interactive elements
- Keyboard navigation support
- WCAG AA color contrast compliance
- Focus indicators

### Performance

- Lazy loading for images and components
- Skeleton loaders for better perceived performance
- Optimized animations and transitions

## License

This project is created for demonstration purposes.

## Contributing

This is a complete implementation ready for backend integration. To integrate with a real API:

1. Replace mock data in `lib/mock-data.ts` with API calls
2. Add authentication logic in auth pages
3. Implement file upload/download functionality
4. Connect to your backend API endpoints

---

Made with ❤️ for the devotional community

