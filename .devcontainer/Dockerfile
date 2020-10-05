# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.134.0/containers/javascript-node/.devcontainer/base.Dockerfile
ARG VARIANT="14"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

ARG USERNAME=node
ENV USERNAME=${USERNAME}

RUN mkdir -p /home/${USERNAME}/.vscode-server/extensions \
        /home/${USERNAME}/.vscode-server-insiders/extensions \
        /home/${USERNAME}/.gnupg \
    && chown -R ${USERNAME} \
        /home/${USERNAME}/.vscode-server \
        /home/${USERNAME}/.vscode-server-insiders \
        /home/${USERNAME}/.gnupg
RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
    && echo $SNIPPET >> "/root/.bashrc" \
    # [Optional] If you have a non-root user
    && mkdir /commandhistory \
    && touch /commandhistory/.bash_history \
    && chown -R ${USERNAME} /commandhistory \
    && echo $SNIPPET >> "/home/${USERNAME}/.bashrc"
COPY conf/gpg-agent.conf "/home/${USERNAME}/.gnupg"
COPY conf/gpg.conf "/home/${USERNAME}/.gnupg"    
RUN chmod 600 /home/${USERNAME}/.gnupg/* && chmod 700 /home/${USERNAME}/.gnupg
# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
# RUN sudo -u node npm install -g <your-package-list-here>