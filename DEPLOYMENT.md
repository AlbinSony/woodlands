# Deployment Guide - Woodlands Resort Website

## 📦 Pre-Deployment Checklist

- [ ] All content is updated and accurate
- [ ] Images are optimized (use WebP format, compressed)
- [ ] Contact information is correct
- [ ] Social media links are updated
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile, tablet, and desktop
- [ ] All forms are working correctly
- [ ] SEO meta tags are updated in `index.html`

## 🚀 Deployment Options

### Option 1: Netlify (Recommended - Free & Easy)

#### Method A: Drag & Drop
1. Build the project:
   ```bash
   npm run build
   ```
2. Go to [Netlify](https://www.netlify.com/)
3. Sign up or log in
4. Drag the `dist` folder to Netlify
5. Your site is live!

#### Method B: Git Integration (Automatic Deployments)
1. Push your code to GitHub
2. Go to [Netlify](https://www.netlify.com/)
3. Click "New site from Git"
4. Choose GitHub and select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"
7. Every push to your repo will auto-deploy!

#### Custom Domain on Netlify
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure DNS

---

### Option 2: Vercel (Also Free & Great)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts
4. Your site is live!

#### Or use Vercel Dashboard:
1. Go to [Vercel](https://vercel.com/)
2. Import your GitHub repository
3. Vercel auto-detects Vite configuration
4. Click Deploy

---

### Option 3: GitHub Pages

1. Install gh-pages:
   ```bash
   npm install gh-pages --save-dev
   ```

2. Update `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/woodlands",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Update `vite.config.js`:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/woodlands/', // Your repo name
   })
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

5. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Source: gh-pages branch

---

### Option 4: Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login:
   ```bash
   firebase login
   ```

3. Initialize:
   ```bash
   firebase init hosting
   ```
   - Choose existing project or create new
   - Public directory: `dist`
   - Single-page app: Yes
   - Automatic builds: No

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

---

### Option 5: Traditional Web Hosting (cPanel)

1. Build the project:
   ```bash
   npm run build
   ```

2. Connect to your hosting via FTP (FileZilla, WinSCP)

3. Upload all files from `dist` folder to `public_html` or `www` directory

4. Your site is live!

---

## 🔧 Environment Variables (if needed)

Create `.env` file in root:
```env
VITE_API_URL=your_api_url
VITE_CONTACT_EMAIL=info@woodlands.com
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 📊 Performance Optimization

### Image Optimization
1. Use [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
2. Convert to WebP format
3. Use appropriate sizes (don't use 4K images for thumbnails)

### Code Optimization
Already handled by Vite:
- Tree shaking
- Code splitting
- Minification
- CSS optimization

---

## 🌐 Custom Domain Setup

### Netlify
1. Domain settings → Add custom domain
2. Configure DNS at your domain registrar:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

### Vercel
1. Project settings → Domains
2. Add your domain
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

---

## 📈 Analytics Setup

### Google Analytics
1. Get tracking ID from [Google Analytics](https://analytics.google.com/)
2. Add to `index.html` before `</head>`:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

---

## 🔒 SSL Certificate

Most platforms provide free SSL:
- **Netlify**: Automatic HTTPS
- **Vercel**: Automatic HTTPS
- **Firebase**: Automatic HTTPS
- **GitHub Pages**: Automatic HTTPS

For traditional hosting, use [Let's Encrypt](https://letsencrypt.org/) (free)

---

## 📧 Contact Form Integration

### Option 1: Formspree (Easy)
```jsx
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  {/* form fields */}
</form>
```

### Option 2: EmailJS
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Install: `npm install @emailjs/browser`
3. Use in your component

### Option 3: Backend API
Create a backend service (Node.js, PHP) to handle form submissions

---

## 🔍 SEO Optimization

Already included in `index.html`, but customize:
```html
<title>Woodlands Resort - Best Stay in Thekkady</title>
<meta name="description" content="Experience luxury and nature at Woodlands Resort, Kumily. Premium accommodation since 1958." />
<meta name="keywords" content="resort, kumily, thekkady, kerala, hotel, accommodation" />

<!-- Open Graph (Facebook) -->
<meta property="og:title" content="Woodlands Resort" />
<meta property="og:description" content="Your perfect stay in Thekkady" />
<meta property="og:image" content="URL_TO_IMAGE" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Woodlands Resort" />
```

---

## 📱 Progressive Web App (PWA)

To make it installable:

1. Install Vite PWA plugin:
   ```bash
   npm install vite-plugin-pwa -D
   ```

2. Update `vite.config.js`:
   ```javascript
   import { VitePWA } from 'vite-plugin-pwa'
   
   export default defineConfig({
     plugins: [
       react(),
       VitePWA({
         registerType: 'autoUpdate',
         manifest: {
           name: 'Woodlands Resort',
           short_name: 'Woodlands',
           theme_color: '#a50102',
           icons: [/* your icons */]
         }
       })
     ]
   })
   ```

---

## 🐛 Troubleshooting

### Blank page after deployment
- Check browser console for errors
- Ensure `base` path is correct in `vite.config.js`
- Clear cache and hard reload

### Images not loading
- Check image paths (use relative paths)
- Ensure images are in `public` folder or imported in components

### Routing issues (404 on refresh)
- Configure redirects (for SPA)
- Netlify: Create `_redirects` file in `public`:
  ```
  /*    /index.html   200
  ```

---

## 📞 Post-Deployment

1. Test all functionality
2. Submit to Google Search Console
3. Create Google My Business listing
4. Share on social media
5. Monitor analytics
6. Collect customer feedback

---

## 🔄 Updates & Maintenance

To update the live site:
1. Make changes locally
2. Test thoroughly
3. Build: `npm run build`
4. Deploy (method depends on platform)
5. Verify changes on live site

---

## 💡 Pro Tips

- Use a CDN for static assets
- Enable caching
- Monitor performance with Lighthouse
- Keep dependencies updated
- Regular backups
- Monitor uptime (use UptimeRobot)

---

Need help? Refer to platform-specific documentation or contact support.

**Recommended Hosting**: Netlify or Vercel for best performance and ease of use.
