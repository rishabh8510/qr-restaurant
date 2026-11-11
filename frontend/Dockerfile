FROM nginx:alpine

# Copy pre-compiled frontend assets
COPY dist /usr/share/nginx/html/admin
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
