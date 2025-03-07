# NGINX Configuration and Startup Guide

Welcome to the NGINX Configuration and Startup Guide! This document will guide you through naming the NGINX config file, starting NGINX, and provide a reference config file.

## Naming the NGINX Config File

The default name for the main NGINX configuration file is `nginx.conf`. You can find it in the `/etc/nginx/` directory on most systems. If you want to use a different name, you can specify it when starting NGINX.

## Starting NGINX

To start NGINX, you can use the following command:

```bash
sudo nginx
```

If you want to specify a different configuration file, you can use the `-c` flag followed by the path to your config file:

```bash
sudo nginx -c /path/to/your/nginx.conf
```

## Reference NGINX Config File

Here's a basic example of an NGINX configuration file:

```nginx
# Define worker processes
worker_processes auto;

# Define the events block
events {
    worker_connections 1024;
}

# Define the HTTP block
http {
    # Include MIME types
    include mime.types;
    default_type application/octet-stream;

    # Define log format
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    # Access and error logs
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    # Define the server block
    server {
        listen 80;
        server_name example.com;

        # Define the location block
        location / {
            root /usr/share/nginx/html;
            index index.html index.htm;
        }
    }
}
```

This configuration sets up a basic web server listening on port 80, serving files from `/usr/share/nginx/html`.

Feel free to modify this configuration to suit your needs!

