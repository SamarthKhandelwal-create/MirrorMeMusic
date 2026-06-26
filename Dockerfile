FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    build-essential \
    python3 \
    ripgrep \
    jq \
    unzip \
    vim \
    less \
    sudo \
  && rm -rf /var/lib/apt/lists/*

ARG USERNAME=node

RUN echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME

RUN npm install -g @anthropic-ai/claude-code

USER $USERNAME
WORKDIR /workspace

ENV SHELL=/bin/bash

CMD ["bash"]
