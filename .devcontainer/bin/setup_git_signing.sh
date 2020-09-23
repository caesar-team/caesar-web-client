#!/bin/sh
KEYID=$(gpg --list-secret-keys --with-colons | awk -F: '$1 == "sec" {print $5}')
git config --global user.signingkey $KEYID
git config --global commit.gpgsign true