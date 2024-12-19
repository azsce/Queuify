FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu

# Install zsh
RUN apt-get update && apt-get install -y zsh curl git

# Install bun
RUN curl -fsSL https://bun.sh/install | bash

# Set up bun in zsh
RUN echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.zshrc

# Install oh-my-zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Define $ZSH_CUSTOM if not set
ENV ZSH_CUSTOM=${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}

# Clone ZSH plugins
RUN git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions && \
    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting && \
    git clone https://github.com/zdharma-continuum/fast-syntax-highlighting.git $ZSH_CUSTOM/plugins/fast-syntax-highlighting && \
    git clone --depth 1 https://github.com/marlonrichert/zsh-autocomplete.git $ZSH_CUSTOM/plugins/zsh-autocomplete

# Ensure .zshrc exists and update plugins list
RUN touch ~/.zshrc && \
    sed -i 's/plugins=(git)/plugins=(git zsh-autosuggestions zsh-syntax-highlighting fast-syntax-highlighting zsh-autocomplete)/g' ~/.zshrc

# Set zsh as the default shell
RUN chsh -s $(which zsh)
