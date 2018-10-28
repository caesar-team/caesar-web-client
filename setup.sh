#!/usr/bin/env bash
apt-get update;
apt-get install build-essential libssl-dev -y;
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
command -v nvm;
nvm install 8.12.0;
npm intsall -g yarn;
command -v yarn;