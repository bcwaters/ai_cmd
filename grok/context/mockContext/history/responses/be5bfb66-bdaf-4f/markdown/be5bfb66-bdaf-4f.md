# Error with `js_path` Directive in NGINX Configuration

The error message you're encountering indicates that NGINX is unable to recognize the `js_path` directive in your configuration file. This suggests that the NGINX JavaScript module, which is necessary for using `js_path`, is not installed or enabled on your server.

To resolve this issue, you need to install and enable the NGINX JavaScript module. Here's how you can do it:

1. **Install the NGINX JavaScript Module:**
   On systems that use `apt` (like Ubuntu or Debian), you can install the module by running:
   ```bash
   sudo apt-get install libnginx-mod-http-js
   ```
   For other systems, you may need to compile NGINX from source with the `--with-http_js_module` configuration option.

2. **Enable the Module in NGINX:**
   After installation, ensure that the module is enabled in your NGINX configuration. You might need to add or uncomment a line in your `nginx.conf` or a related configuration file to include the module:
   ```nginx
   load_module modules/ngx_http_js_module.so;
   ```

3. **Restart NGINX:**
   Once the module is installed and enabled, restart NGINX to apply the changes:
   ```bash
   sudo systemctl restart nginx
   ```

After following these steps, the `js_path` directive should be recognized, and your configuration should work as expected.

