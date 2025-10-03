# Customization Guide - Woodlands Resort Website

This guide will help you customize various aspects of your website without breaking anything!

## 🎨 Colors

### Change Primary Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#YOUR_COLOR',        // Main brand color
      primaryDark: '#DARKER_COLOR',  // Darker shade for hover
      accent: '#ACCENT_COLOR',       // For links/highlights
    }
  }
}
```

**Current Colors:**
- Primary: #a50102 (Red)
- Primary Dark: #990100 (Darker Red)
- Accent: #101996 (Blue)

**After changing, restart dev server:**
```bash
npm run dev
```

### Using Colors in Components

```jsx
// Background
<div className="bg-primary">Content</div>

// Text
<div className="text-primary">Content</div>

// Border
<div className="border-primary">Content</div>

// Hover states
<div className="hover:bg-primary">Content</div>
```

## 🔤 Typography

### Change Fonts

1. Find new fonts on [Google Fonts](https://fonts.google.com/)

2. Update `src/index.css` import:
```css
@import url('https://fonts.googleapis.com/css2?family=YOUR_FONT:wght@400;500;600;700&display=swap');
```

3. Update `tailwind.config.js`:
```javascript
fontFamily: {
  garamond: ['"Your Heading Font"', 'serif'],
  sans: ['"Your Body Font"', 'sans-serif'],
}
```

### Font Sizes

Use Tailwind classes:
```jsx
<h1 className="text-4xl">Large heading</h1>
<p className="text-base">Normal text</p>
<small className="text-sm">Small text</small>
```

## 📝 Content

### Update Hero Text

Edit `src/components/Hero.jsx`:

```jsx
<h1 className="...">
  Your New Headline
  <br />
  Second Line
</h1>
<p className="...">
  Your new subtitle text
</p>
```

### Update About Content

Edit `src/components/About.jsx`:

```jsx
const About = () => {
  return (
    <section>
      {/* Change heading */}
      <h2>Your Heading</h2>
      
      {/* Change description */}
      <p>Your description text...</p>
    </section>
  )
}
```

### Update Room Data

Edit `src/components/Rooms.jsx`:

```javascript
const roomsData = [
  {
    id: 1,
    name: 'Your Room Name',
    description: 'Room description here',
    features: [
      'Feature 1',
      'Feature 2',
      'Feature 3'
    ],
    image: 'https://your-image-url.com/image.jpg',
    price: '₹YOUR_PRICE',
  },
  // Add more rooms...
];
```

### Update Amenities

Edit `src/components/Amenities.jsx`:

```javascript
const amenitiesData = [
  {
    icon: 'fa-your-icon',  // Font Awesome icon name
    title: 'Amenity Title',
    description: 'Amenity description',
  },
  // Add more amenities...
];
```

**Find Font Awesome icons:** [fontawesome.com/icons](https://fontawesome.com/icons)

### Update Testimonials

Edit `src/components/Testimonials.jsx`:

```javascript
const testimonialsData = [
  {
    id: 1,
    name: 'Customer Name',
    role: 'Customer Role/Title',
    image: 'avatar-url',
    text: 'Testimonial text here...',
  },
  // Add more testimonials...
];
```

## 🖼️ Images

### Hero Slider Images

Edit `src/components/Hero.jsx`:

```javascript
const heroImages = [
  'https://your-cdn.com/image1.jpg',
  'https://your-cdn.com/image2.jpg',
  'https://your-cdn.com/image3.jpg',
];
```

**Best Practices:**
- Use high-quality images (1920x1080 or larger)
- Compress before uploading (use TinyPNG)
- Use WebP format for best performance
- Host on CDN for faster loading

### Gallery Images

Edit `src/components/Gallery.jsx`:

```javascript
const galleryImages = [
  'image-url-1.jpg',
  'image-url-2.jpg',
  'image-url-3.jpg',
  'image-url-4.jpg',
  'image-url-5.jpg',
];
```

### Image Optimization Services

- [TinyPNG](https://tinypng.com/) - Compress images
- [Squoosh](https://squoosh.app/) - Convert to WebP
- [Cloudinary](https://cloudinary.com/) - Image CDN (free tier)
- [ImgBB](https://imgbb.com/) - Free image hosting

## 📞 Contact Information

### Update Phone & Email

1. **Header** (`src/components/Header.jsx`):
```jsx
<a href="tel:+919876543210">+91 98765 43210</a>
<a href="mailto:your@email.com">your@email.com</a>
```

2. **Footer** (`src/components/Footer.jsx`):
```jsx
// Same format as above
```

3. **Booking Form** (`src/components/BookingForm.jsx`):
```jsx
// Update contact cards
```

### Update Address

Edit Footer component:
```jsx
<span>
  Your Resort Name,
  Your Address Line 1,
  Your Address Line 2
</span>
```

## 🔗 Social Media Links

Edit `src/components/Footer.jsx`:

```jsx
<a href="https://facebook.com/yourpage" ...>
<a href="https://instagram.com/yourprofile" ...>
<a href="https://twitter.com/yourprofile" ...>
<a href="https://youtube.com/yourchannel" ...>
```

Also update in `src/components/Gallery.jsx` for Instagram link.

## 📋 Forms

### Booking Form Fields

Edit `src/components/BookingForm.jsx`:

To add a new field:
```jsx
<div>
  <label htmlFor="newfield">New Field Label *</label>
  <input
    type="text"
    id="newfield"
    name="newfield"
    value={formData.newfield}
    onChange={handleChange}
    required
    className="..."
  />
</div>
```

Don't forget to add to state:
```javascript
const [formData, setFormData] = useState({
  // ... existing fields
  newfield: '',
});
```

### Form Submission

Configure backend in `handleSubmit` function:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Option 1: Formspree
  await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  // Option 2: Custom API
  await fetch('/api/booking', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
};
```

## ⚙️ Settings & Configuration

### Smooth Scroll Settings

Edit `src/App.jsx`:

```javascript
const lenis = new Lenis({
  duration: 1.2,      // Scroll duration (seconds)
  easing: ...,        // Easing function
  smoothWheel: true,  // Smooth scroll with mouse wheel
  wheelMultiplier: 1, // Scroll speed (1 = normal)
});
```

### Animation Speed

Edit `tailwind.config.js`:

```javascript
animation: {
  'fade-in': 'fadeIn 0.6s ease-out forwards',  // Change 0.6s
  'slide-up': 'slideUp 0.8s ease-out forwards', // Change 0.8s
}
```

### Scroll Reveal Delay

Edit any component using `ScrollReveal`:

```jsx
<ScrollReveal delay={200}> {/* Milliseconds */}
  <div>Content</div>
</ScrollReveal>
```

## 📱 Responsive Breakpoints

Change breakpoints in `tailwind.config.js`:

```javascript
theme: {
  screens: {
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
  }
}
```

## 🎯 Adding New Sections

### 1. Create Component

Create `src/components/NewSection.jsx`:

```jsx
import React from 'react';
import ScrollReveal from './ScrollReveal';

const NewSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <ScrollReveal>
          <h2 className="text-4xl font-bold font-garamond">
            Your Section Title
          </h2>
          <p className="text-gray-600">
            Your content here
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default NewSection;
```

### 2. Import in App

Edit `src/App.jsx`:

```jsx
import NewSection from './components/NewSection';

function App() {
  return (
    <div>
      {/* ... other components */}
      <NewSection />
      {/* ... */}
    </div>
  );
}
```

### 3. Add to Navigation

Edit `src/components/Header.jsx`:

```jsx
<a href="#newsection">New Section</a>
```

## 🔧 Advanced Customization

### Custom Tailwind Classes

Add to `tailwind.config.js`:

```javascript
theme: {
  extend: {
    spacing: {
      '128': '32rem',
    },
    borderRadius: {
      '4xl': '2rem',
    }
  }
}
```

### Custom CSS

Add to `src/index.css`:

```css
.custom-class {
  /* Your custom styles */
}
```

### Custom Components

Create reusable button component:

```jsx
// src/components/Button.jsx
const Button = ({ children, variant = 'primary' }) => {
  const baseClasses = "px-6 py-3 rounded-full font-medium";
  const variants = {
    primary: "bg-primary hover:bg-primaryDark text-white",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white"
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  );
};
```

## 📊 SEO Customization

Edit `index.html`:

```html
<head>
  <title>Your Resort Name | Your Tagline</title>
  <meta name="description" content="Your resort description..." />
  <meta name="keywords" content="resort, hotel, your, keywords" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="Your Resort" />
  <meta property="og:description" content="Description" />
  <meta property="og:image" content="URL to image" />
  <meta property="og:url" content="Your website URL" />
</head>
```

## 🚀 Performance Tuning

### Reduce Bundle Size

Remove unused components:
1. Comment out unused imports in `App.jsx`
2. Build: `npm run build`
3. Check bundle size in `dist` folder

### Image Loading

Change loading strategy:

```jsx
// Eager load (immediate)
<img loading="eager" ... />

// Lazy load (on scroll)
<img loading="lazy" ... />
```

## 💡 Quick Tips

1. **Always test after changes**: `npm run dev`
2. **Use browser DevTools**: F12 to inspect
3. **Check mobile view**: DevTools responsive mode
4. **Keep backups**: Git commit after working changes
5. **Read Tailwind docs**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
6. **Search Font Awesome**: [fontawesome.com/search](https://fontawesome.com/search)

## 🐛 Troubleshooting

### Changes Not Showing

1. Clear browser cache (Ctrl+Shift+R)
2. Restart dev server
3. Check if file saved
4. Check console for errors

### Styles Not Working

1. Check Tailwind class name spelling
2. Verify class is in Tailwind docs
3. Check if custom class defined
4. Inspect element in browser

### Component Not Displaying

1. Check import/export
2. Verify component added to App.jsx
3. Check for JavaScript errors
4. Verify all required props passed

## 📚 Resources

- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Font Awesome Icons](https://fontawesome.com/icons)
- [Google Fonts](https://fonts.google.com)
- [Unsplash (Free Photos)](https://unsplash.com)

---

**Need more help?** Check the other documentation files or search online resources!

Happy customizing! 🎨
