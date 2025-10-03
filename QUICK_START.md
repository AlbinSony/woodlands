# Woodlands Resort - Quick Start Guide

## 🚀 Running the Project

### Development Mode
```bash
npm run dev
```
Visit: `http://localhost:5174/`

### Production Build
```bash
npm run build
npm run preview
```

## 📝 Content Updates

### Updating Room Information
Edit `src/components/Rooms.jsx`:
```javascript
const roomsData = [
  {
    name: 'Your Room Name',
    description: 'Room description',
    features: ['Feature 1', 'Feature 2'],
    image: 'image-url',
    price: '₹Price',
  },
  // Add more rooms...
];
```

### Updating Amenities
Edit `src/components/Amenities.jsx`:
```javascript
const amenitiesData = [
  {
    icon: 'fa-icon-name', // Font Awesome icon
    title: 'Service Title',
    description: 'Service description',
  },
  // Add more amenities...
];
```

### Updating Testimonials
Edit `src/components/Testimonials.jsx`:
```javascript
const testimonialsData = [
  {
    name: 'Customer Name',
    role: 'Customer Role',
    text: 'Testimonial text',
  },
  // Add more testimonials...
];
```

### Updating Hero Images
Edit `src/components/Hero.jsx`:
```javascript
const heroImages = [
  'image-url-1',
  'image-url-2',
  'image-url-3',
];
```

### Updating Gallery
Edit `src/components/Gallery.jsx`:
```javascript
const galleryImages = [
  'image-url-1',
  'image-url-2',
  // Add more images...
];
```

## 🎨 Styling

### Colors
Primary colors are defined in `tailwind.config.js`:
- `primary`: #a50102 (main red)
- `primaryDark`: #990100 (darker red)
- `accent`: #101996 (blue accent)

Use in components:
```jsx
<div className="bg-primary text-white">Content</div>
<div className="bg-primaryDark hover:bg-primary">Button</div>
```

### Fonts
- Headings: `font-garamond`
- Body text: `font-sans` (Work Sans)

```jsx
<h2 className="font-garamond text-4xl">Heading</h2>
<p className="font-sans text-base">Body text</p>
```

## 🔧 Common Tasks

### Adding a New Section
1. Create component in `src/components/YourSection.jsx`
2. Import in `src/App.jsx`
3. Add to the component tree
4. Update navigation in `src/components/Header.jsx`

### Changing Contact Information
Edit `src/components/Header.jsx` and `src/components/Footer.jsx`

### Adding New Pages (for future expansion)
Install React Router:
```bash
npm install react-router-dom
```

## 🌐 Deployment

### Deploy to Netlify
1. Build the project: `npm run build`
2. Drag the `dist` folder to Netlify
3. Or connect your Git repository for automatic deployments

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to GitHub Pages
```bash
npm install gh-pages --save-dev
```

Add to `package.json`:
```json
"homepage": "https://yourusername.github.io/woodlands",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

Run: `npm run deploy`

## 📱 Testing Responsiveness

### Browser DevTools
1. Open DevTools (F12)
2. Click device toolbar icon
3. Test different screen sizes:
   - Mobile: 375px, 414px
   - Tablet: 768px, 1024px
   - Desktop: 1280px, 1920px

### Common Breakpoints
```jsx
// Mobile first approach
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Responsive grid
</div>
```

## 🎯 Performance Tips

1. **Optimize Images**: Use WebP format, compress images
2. **Lazy Loading**: Already implemented for images
3. **Code Splitting**: Vite handles this automatically
4. **Cache Strategy**: Configure in your hosting platform

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill the process using port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Smooth Scroll Not Working
Check if Lenis is properly initialized in `src/App.jsx`. Ensure no conflicting scroll libraries.

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)
- [Lenis Documentation](https://github.com/studio-freight/lenis)
- [Font Awesome Icons](https://fontawesome.com/icons)
- [Unsplash (Free Images)](https://unsplash.com)

## 💡 Tips

1. Use `ScrollReveal` component for animated sections
2. Keep components small and reusable
3. Use Tailwind's utility classes instead of custom CSS
4. Test on real devices, not just browser emulators
5. Optimize images before uploading (use TinyPNG or similar)

---

Need help? Check the main README.md or contact the development team.
