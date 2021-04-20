FROM udevbe/app-endpoint-server:debian-unstable
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y \
    gtk-3-examples \
    kwrite \
    && rm -rf /var/lib/apt/lists/*

COPY config.json5 /usr/src/app
