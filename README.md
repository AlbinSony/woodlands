# Woodlands Resort Website

A modern, responsive resort website built with React and Tailwind CSS, featuring smooth scrolling powered by Lenis.

## 🌟 Features

- **Smooth Scrolling**: Implemented using Lenis library for butter-smooth scroll experience
- **Scroll Reveal Animations**: Content animates into view as you scroll
- **Fully Responsive**: Works perfectly on all devices (mobile, tablet, desktop)
- **Lazy Loading**: Images are lazy-loaded for optimal performance
- **Modern Design**: Clean, professional design with premium color scheme (#a50102, #990100)
- **Interactive Components**: 
  - Image slider on hero section
  - Tabbed room selection
  - Interactive testimonials
  - Social media gallery
  - Newsletter signup
  
## 🎨 Design

The website follows a modern, elegant design inspired by luxury resort aesthetics:
- Primary Colors: #a50102 (primary), #990100 (primary dark)
- Typography: EB Garamond (headings), Work Sans (body)
- Smooth animations and transitions throughout
- Professional photography with overlays

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd WOODLANDS
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

The website will be available at `http://localhost:5174/` (or another port if 5174 is busy)

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## 📦 Technologies Used

- **React** - UI framework
- **Tailwind CSS v3** - Utility-first CSS framework
- **Lenis** - Smooth scroll library
- **Vite** - Build tool and dev server
- **React Intersection Observer** - For scroll reveal animations
- **Font Awesome** - Icons

## 📁 Project Structure

```
WOODLANDS/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation bar
│   │   ├── Hero.jsx            # Hero section with slider
│   │   ├── About.jsx           # About section
│   │   ├── Rooms.jsx           # Rooms showcase
│   │   ├── Amenities.jsx       # Amenities section
│   │   ├── Testimonials.jsx    # Customer reviews
│   │   ├── Gallery.jsx         # Photo gallery
│   │   ├── Footer.jsx          # Footer section
│   │   └── ScrollReveal.jsx    # Scroll animation wrapper
│   ├── App.jsx                 # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── index.html
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── vite.config.js            # Vite configuration
└── package.json
```

## 🎯 Key Components

### Header
- Fixed navigation bar with logo
- Responsive mobile menu
- Smooth scroll to sections
- Call-to-action button

### Hero
- Auto-playing image slider
- Navigation arrows
- Slide indicators
- Prominent CTA

### About
- Resort information
- Image gallery
- Feature highlights

### Rooms
- Tabbed room selection
- Room details and pricing
- High-quality images

### Amenities
- Grid layout of services
- Icon-based design
- Hover effects

### Testimonials
- Customer reviews
- Interactive cards
- Dot navigation

### Gallery
- Instagram-style grid
- Social media integration
- Hover effects

### Footer
- Newsletter signup
- Contact information
- Quick links
- Social media links

## 🔧 Customization

### Colors
Edit `tailwind.config.js` to change the color scheme:
```js
colors: {
  primary: '#a50102',
  primaryDark: '#990100',
  accent: '#101996',
}
```

### Fonts
Fonts are imported in `src/index.css`. Update the Google Fonts URL to change fonts.

### Content
Update content in respective component files in `src/components/`

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## ⚡ Performance

- Lazy loading images
- Optimized animations
- Code splitting
- Minified production build
- Fast initial load time

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is private and proprietary.

## 👥 Contact

Woodlands Resort
- Location: Kumily, Thekkady, Kerala
- Phone: +91 94470 21958
- Email: info@woodlands.com

---

Built with ❤️ using React + Tailwind CSS


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
