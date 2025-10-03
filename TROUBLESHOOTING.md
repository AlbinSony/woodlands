# Troubleshooting Guide - Common Issues & Solutions

## 🚨 Development Issues

### Issue: Dev Server Won't Start

**Symptoms:**
- Error when running `npm run dev`
- Port already in use error

**Solutions:**

1. **Port in use:**
   ```bash
   # Windows
   netstat -ano | findstr :5173
   taskkill /PID <PID_NUMBER> /F
   
   # Or just use different port (Vite will auto-detect)
   npm run dev
   ```

2. **Dependencies not installed:**
   ```bash
   npm install
   ```

3. **Node modules corrupted:**
   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

---

### Issue: Blank White Page

**Symptoms:**
- Website shows nothing, just white screen
- No errors in terminal

**Solutions:**

1. **Check browser console (F12):**
   - Look for JavaScript errors
   - Look for failed network requests

2. **Clear browser cache:**
   - Hard reload: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

3. **Check App.jsx imports:**
   - Ensure all components are imported correctly
   - Check for typos in component names

4. **Verify all files exist:**
   - Check all component files in src/components/
   - Ensure no missing files

---

### Issue: Tailwind Styles Not Working

**Symptoms:**
- Classes not applying
- Website looks unstyled

**Solutions:**

1. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Check tailwind.config.js:**
   - Ensure content paths are correct:
   ```javascript
   content: [
     "./index.html",
     "./src/**/*.{js,ts,jsx,tsx}",
   ]
   ```

3. **Verify index.css has Tailwind directives:**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. **Reinstall Tailwind:**
   ```bash
   npm uninstall tailwindcss postcss autoprefixer
   npm install -D tailwindcss@^3 postcss autoprefixer
   ```

---

### Issue: Smooth Scroll Not Working

**Symptoms:**
- Scroll is jumpy/not smooth
- Lenis not working

**Solutions:**

1. **Check Lenis installation:**
   ```bash
   npm install lenis@^1.3.11
   ```

2. **Verify initialization in App.jsx:**
   - Check useEffect is present
   - Check raf function is called

3. **Browser compatibility:**
   - Some browsers may not support all features
   - Test in Chrome/Firefox first

4. **Check console for errors:**
   - Open DevTools (F12)
   - Look for Lenis errors

---

### Issue: Images Not Loading

**Symptoms:**
- Broken image icons
- Images show alt text only

**Solutions:**

1. **Check image URLs:**
   - Ensure URLs are valid and accessible
   - Test URL in browser directly

2. **Check network tab:**
   - Open DevTools > Network
   - Look for failed image requests
   - Check response status (404 = not found)

3. **Use proper image paths:**
   ```jsx
   // ✅ Correct - Absolute URL
   <img src="https://domain.com/image.jpg" />
   
   // ✅ Correct - Public folder
   <img src="/logo.png" />
   
   // ❌ Wrong - Relative paths may fail
   <img src="../../images/photo.jpg" />
   ```

4. **CORS issues:**
   - Some image hosts block cross-origin requests
   - Use images from your own domain or CDN

---

### Issue: Mobile Menu Not Working

**Symptoms:**
- Hamburger icon doesn't toggle menu
- Menu stays open/closed

**Solutions:**

1. **Check state in Header.jsx:**
   ```jsx
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   ```

2. **Verify onClick handler:**
   ```jsx
   onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
   ```

3. **Check conditional rendering:**
   ```jsx
   {mobileMenuOpen && (
     <div>Menu content</div>
   )}
   ```

4. **Test in mobile view:**
   - DevTools > Responsive mode
   - Set width < 1024px

---

### Issue: Forms Not Submitting

**Symptoms:**
- Submit button does nothing
- Form refreshes page
- Data not being sent

**Solutions:**

1. **Prevent default form behavior:**
   ```jsx
   const handleSubmit = (e) => {
     e.preventDefault(); // IMPORTANT!
     // Your submit logic
   };
   ```

2. **Check form action:**
   ```jsx
   <form onSubmit={handleSubmit}> {/* Not just onClick on button */}
   ```

3. **Configure backend:**
   - Set up Formspree, EmailJS, or custom API
   - Update form action URL

4. **Check validation:**
   - Ensure required fields are filled
   - Check browser console for validation errors

---

### Issue: Animations Not Working

**Symptoms:**
- ScrollReveal not triggering
- No fade-in/slide-up effects

**Solutions:**

1. **Check react-intersection-observer:**
   ```bash
   npm install react-intersection-observer
   ```

2. **Verify ScrollReveal usage:**
   ```jsx
   import ScrollReveal from './components/ScrollReveal';
   
   <ScrollReveal>
     <div>Content</div>
   </ScrollReveal>
   ```

3. **Check CSS animations:**
   - Ensure animate-on-scroll classes in index.css
   - Verify Tailwind animation config

4. **Test scroll behavior:**
   - Scroll down and up to trigger
   - Some animations trigger once only

---

## 🏗️ Build Issues

### Issue: Build Fails

**Symptoms:**
- `npm run build` shows errors
- Build process stops

**Solutions:**

1. **Read error message carefully:**
   - Identifies exact file and line
   - Follow error instructions

2. **Common build errors:**
   
   **Unused imports:**
   ```jsx
   // Remove unused imports
   // import { unused } from 'module'; ❌
   ```
   
   **Missing dependencies:**
   ```bash
   npm install
   ```
   
   **Syntax errors:**
   - Check for missing brackets
   - Check for unclosed tags
   - Run `npm run dev` first to catch errors

3. **Clear dist folder:**
   ```bash
   rm -rf dist
   npm run build
   ```

---

### Issue: Production Build Doesn't Work

**Symptoms:**
- Dev works fine, but built version doesn't
- Deployed site shows errors

**Solutions:**

1. **Test build locally:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Check base path:**
   - In vite.config.js for GitHub Pages:
   ```javascript
   base: '/repo-name/'
   ```

3. **Check environment variables:**
   - Ensure all env vars are set in production
   - Use VITE_ prefix for Vite variables

4. **Check routing:**
   - For SPA, configure server redirects
   - Netlify: add `_redirects` file in public/

---

## 🌐 Deployment Issues

### Issue: Website Not Updating After Deploy

**Solutions:**

1. **Clear CDN cache:**
   - Netlify: Deploys > Trigger Deploy > Clear cache
   - Vercel: Redeploy

2. **Clear browser cache:**
   - Hard reload: Ctrl+Shift+R
   - Clear cache in browser settings

3. **Check deployment logs:**
   - Look for build errors
   - Verify deploy was successful

---

### Issue: 404 on Page Refresh

**Symptoms:**
- Direct URLs work
- Refresh gives 404 error

**Solutions:**

1. **Configure SPA redirects:**
   
   **Netlify:**
   Create `public/_redirects`:
   ```
   /*    /index.html   200
   ```
   
   **Vercel:**
   Create `vercel.json`:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/" }
     ]
   }
   ```

---

## 🎨 Styling Issues

### Issue: Hover Effects Not Working on Mobile

**This is expected behavior!**
- Touch devices don't have "hover"
- Use active states instead:
  ```jsx
  className="hover:bg-primary active:bg-primary"
  ```

---

### Issue: Layout Breaks on Certain Screen Sizes

**Solutions:**

1. **Test all breakpoints:**
   - DevTools > Responsive mode
   - Test 375px, 768px, 1024px, 1920px

2. **Use responsive classes:**
   ```jsx
   className="text-sm md:text-base lg:text-lg"
   ```

3. **Check for fixed widths:**
   - Avoid: `width: 500px`
   - Use: `max-w-2xl` or similar

---

## ⚡ Performance Issues

### Issue: Slow Loading

**Solutions:**

1. **Optimize images:**
   - Compress with TinyPNG
   - Use WebP format
   - Appropriate sizes (don't use 4K for thumbnails)

2. **Check bundle size:**
   ```bash
   npm run build
   # Check dist/ folder size
   ```

3. **Use lazy loading:**
   ```jsx
   <img loading="lazy" ... />
   ```

4. **Enable caching:**
   - Configure on hosting platform
   - Set appropriate cache headers

---

### Issue: Lighthouse Score Low

**Solutions:**

1. **Optimize images** (biggest impact)
2. **Remove unused CSS/JS**
3. **Enable compression on server**
4. **Use CDN for assets**
5. **Minimize third-party scripts**

---

## 🔒 Security Issues

### Issue: Form Spam

**Solutions:**

1. **Add honeypot field:**
   ```jsx
   <input 
     type="text" 
     name="website" 
     className="hidden"
     tabIndex="-1" 
     autoComplete="off" 
   />
   ```
   - Bots fill this
   - Reject if filled

2. **Use Formspree with spam protection**

3. **Add CAPTCHA:**
   - Google reCAPTCHA
   - hCaptcha

---

## 🐛 JavaScript Errors

### Issue: "Cannot read property of undefined"

**Solutions:**

1. **Add null checks:**
   ```jsx
   // ❌ May error
   data.items.map(...)
   
   // ✅ Safe
   data?.items?.map(...) ?? []
   ```

2. **Provide default values:**
   ```jsx
   const items = data.items || [];
   ```

---

### Issue: "React Hook useEffect has missing dependencies"

**This is a warning, not an error.**

**Solutions:**

1. **Add dependencies:**
   ```jsx
   useEffect(() => {
     // code using 'value'
   }, [value]); // Add here
   ```

2. **Or disable for specific line:**
   ```jsx
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   ```

---

## 📱 Mobile-Specific Issues

### Issue: Touch Scrolling Feels Weird

**Solution:**
```css
/* Add to index.css */
* {
  -webkit-overflow-scrolling: touch;
}
```

---

### Issue: Inputs Zoom on Focus (iOS)

**Solution:**
```html
<!-- In index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

Or increase input font size:
```jsx
className="text-base" // At least 16px
```

---

## 🔍 Debugging Tips

### General Debugging Process

1. **Check browser console first** (F12)
   - Read error messages
   - Look at stack trace
   
2. **Use console.log:**
   ```jsx
   console.log('Value:', value);
   console.log('Props:', props);
   ```

3. **React DevTools:**
   - Install React DevTools extension
   - Inspect component state/props

4. **Network tab:**
   - Check API requests
   - Check image loading
   - Check response status codes

5. **Isolate the problem:**
   - Comment out sections
   - Test one thing at a time
   - Revert recent changes

---

## 📞 Getting Help

### Before Asking for Help

1. ✅ Read error message completely
2. ✅ Check this troubleshooting guide
3. ✅ Search error on Google/Stack Overflow
4. ✅ Check documentation
5. ✅ Try suggested solutions

### When Asking for Help

Provide:
- ✅ Exact error message
- ✅ Steps to reproduce
- ✅ What you've already tried
- ✅ Code snippet (if relevant)
- ✅ Screenshots (if visual issue)

### Useful Resources

- [Stack Overflow](https://stackoverflow.com/)
- [React Documentation](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 💡 Prevention Tips

1. **Commit working code regularly** (Git)
2. **Test after each change**
3. **Keep dependencies updated**
4. **Use TypeScript** (advanced, optional)
5. **Write comments for complex code**
6. **Follow coding standards**
7. **Keep backups**

---

## ✅ Quick Fixes Checklist

When something breaks:

- [ ] Restart dev server
- [ ] Clear browser cache (Ctrl+Shift+R)
- [ ] Check browser console (F12)
- [ ] Read error message carefully
- [ ] Check recent changes
- [ ] Test in different browser
- [ ] Check mobile view separately
- [ ] Verify all files saved
- [ ] Check internet connection
- [ ] Try `npm install` again

---

**Most issues can be solved by:**
1. Reading the error message
2. Restarting the dev server
3. Clearing browser cache
4. Checking browser console

**Still stuck?** Review the documentation or search the error online. Most errors have been solved by someone before!

Good luck! 🍀
