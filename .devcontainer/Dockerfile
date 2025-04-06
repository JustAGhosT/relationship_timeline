# .devcontainer/Dockerfile
FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Install additional tools
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    git-core \
    curl \
    wget \
    unzip \
    nano \
    jq \
    zsh \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Install Oh My Zsh for better terminal experience
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Install global npm packages
RUN npm install -g npm@latest \
    next@latest \
    typescript@latest \
    turbo \
    prettier \
    eslint

# Install pnpm (alternative package manager)
RUN npm install -g pnpm

# Set up non-root user
USER node

# Configure zsh for node user
RUN echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.zshrc \
    && echo 'alias ni="npm install"' >> ~/.zshrc \
    && echo 'alias nd="npm run dev"' >> ~/.zshrc \
    && echo 'alias nb="npm run build"' >> ~/.zshrc \
    && echo 'alias ns="npm run start"' >> ~/.zshrc \
    && echo 'alias nl="npm run lint"' >> ~/.zshrc

# Set working directory
WORKDIR /workspace