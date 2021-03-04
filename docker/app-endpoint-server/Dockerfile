FROM udevbe/app-endpoint-server:debian-unstable

RUN apt-get update && apt-get install -y \
    gtk-3-examples \
    kwrite \
    && rm -rf /var/lib/apt/lists/*

COPY config.json5 /usr/src/app
