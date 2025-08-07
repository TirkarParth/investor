# TRADEFOOX Investor Landing Page

A modern, responsive investor landing page for TRADEFOOX - the European answer to super apps. Built with React, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Professional Design**: Inspired by ByteDance and Meta investor pages
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Modern UI**: Clean, professional design with smooth animations
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Performance**: Optimized for fast loading and smooth interactions

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)

- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Hero section with main CTA
│   ├── Vision.tsx      # Company vision section
│   ├── Features.tsx    # Platform features showcase
│   ├── GlobalScale.tsx # International capabilities
│   ├── Traction.tsx    # Milestones and achievements
│   ├── Team.tsx        # Founder and team info
│   ├── Investment.tsx  # Investment opportunity
│   ├── Contact.tsx     # Contact information
│   └── Footer.tsx      # Footer with links
├── App.tsx             # Main app component
├── index.tsx           # React entry point
└── index.css           # Global styles and Tailwind
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#2563eb) - Trust and professionalism
- **Secondary**: Purple (#7c3aed) - Innovation and creativity
- **Accent**: Yellow (#fbbf24) - Energy and optimism

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Components
- **Buttons**: Primary, secondary, and outline variants
- **Cards**: Hover effects and consistent spacing
- **Sections**: Proper padding and responsive layouts

## 📱 Sections Overview

### 1. Hero Section
- Compelling headline about European super app
- Clear call-to-action buttons
- Key statistics display

### 2. Vision Section
- Company mission and values
- European positioning
- Privacy-first approach

### 3. Features Section
- Six core platform features
- Visual icons and descriptions
- All-in-one platform messaging

### 4. Global Scale
- Multilingual support (5 languages)
- International expansion strategy
- Cross-platform availability

### 5. Traction & Milestones
- Completed achievements
- Current progress
- Future roadmap

### 6. Team Section
- Founder introduction
- Interdisciplinary team
- European DNA focus

### 7. Investment Opportunity
- Series A round details
- Why invest now
- Contact information

### 8. Contact Section
- Multiple contact methods
- Clear next steps
- Professional presentation

## 🔧 Customization

### Content Updates
All content is easily editable in the component files. Key areas to customize:

- **Company Information**: Update in `Hero.tsx` and `Team.tsx`
- **Contact Details**: Modify in `Contact.tsx` and `Footer.tsx`
- **Features**: Edit in `Features.tsx`
- **Investment Details**: Update in `Investment.tsx`

### Styling
- **Colors**: Modify in `tailwind.config.js`
- **Typography**: Update in `src/index.css`
- **Layout**: Adjust in individual component files

### Branding
- **Logo**: Replace in `Header.tsx` and `Footer.tsx`
- **Colors**: Update primary/secondary colors in config
- **Imagery**: Add custom images and icons

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: Optimized with tree shaking
- **Loading Speed**: Fast initial load with lazy loading
- **Mobile Optimization**: Responsive design with touch-friendly interactions

## 🌐 Deployment

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Vercel
1. Import your GitHub repository
2. Framework preset: Create React App
3. Deploy automatically

### AWS S3 + CloudFront
1. Build the project: `npm run build`
2. Upload `build/` folder to S3
3. Configure CloudFront for CDN

## 📈 Analytics Integration

### Google Analytics
Add your GA tracking ID to `public/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Hotjar
Add Hotjar tracking code for user behavior analysis.

## 🔒 Security

- **HTTPS**: Always use HTTPS in production
- **Content Security Policy**: Configure CSP headers
- **Dependencies**: Regular security updates
- **Forms**: Proper validation and sanitization

## 📞 Support

For questions or customization requests:
- **Email**: invest@tradefoox.com
- **LinkedIn**: [TRADEFOOX Company Page](https://linkedin.com/company/tradefoox)

## 📄 License

This project is proprietary to TRADEFOOX. All rights reserved.

---

**Built with ❤️ for TRADEFOOX investors** 