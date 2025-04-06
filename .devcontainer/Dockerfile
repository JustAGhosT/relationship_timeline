# .devcontainer/Dockerfile
FROM mcr.microsoft.com/devcontainers/javascript-node:18

# Install additional tools
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    git-core \
    curl \
    wget \
    unzip \
    nano

# Install global npm packages
RUN npm install -g npm@latest \
    next \
    turbo \
    typescript

# Clean up
RUN apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Set up non-root user
USER node

# Set working directory
WORKDIR /workspace