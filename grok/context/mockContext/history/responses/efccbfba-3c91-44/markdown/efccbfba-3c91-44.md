# Understanding Vercel's Image Optimization

Vercel automatically wraps image requests in serverless functions to optimize performance and reduce the load on your origin server. This optimization includes resizing, format conversion, and caching, which can significantly improve the load time of your web pages.

## Bypassing Vercel's Image Optimization

If you want to bypass this optimization for specific images, you can use the `url` parameter directly in your image tags, bypassing Vercel's automatic optimization. Here's how you can do it:

1. **Direct URL Usage**: Instead of using the optimized image URL provided by Vercel, use the direct URL of the image hosted on your server or a CDN.

   ```html
   <img src="https://your-direct-image-url.com/image.jpg" alt="Description">
   ```

2. **Custom Configuration**: You can also configure Vercel to not optimize certain images by modifying the `vercel.json` configuration file.

   ```json
   {
     "images": {
       "domains": ["your-direct-image-url.com"],
       "disableStaticImages": true
     }
   }
   ```

By implementing these methods, you can bypass Vercel's image optimization for specific use cases where you might need full control over the image delivery.

---

### Follow-up Questions:
- Are there specific images you want to bypass optimization for, and why?
- Have you experienced any issues with Vercel's image optimization that led you to want to bypass it?
- Are you concerned about the performance impact of bypassing Vercel's image optimization?

