FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu

# Install basic tools
RUN apt-get update && apt-get install -y zsh curl git

# Install bun
RUN curl -fsSL https://bun.sh/install | bash
RUN echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.zshrc

# Define $ZSH_CUSTOM if not set
ENV ZSH_CUSTOM=${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}

# Clone ZSH plugins
RUN git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions && \
    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting && \
    git clone https://github.com/zdharma-continuum/fast-syntax-highlighting.git $ZSH_CUSTOM/plugins/fast-syntax-highlighting && \
    git clone --depth 1 https://github.com/marlonrichert/zsh-autocomplete.git $ZSH_CUSTOM/plugins/zsh-autocomplete

# Configure plugins in .zshrc
RUN echo 'plugins=(git zsh-autosuggestions zsh-syntax-highlighting fast-syntax-highlighting zsh-autocomplete)' >> ~/.zshrc

# Activate Oh My Zsh
RUN zsh -c 'source ~/.zshrc'

# Set zsh as the default shell
RUN chsh -s $(which zsh)