#!/bin/sh
export KEYID=$(gpg --list-secret-keys --with-colons | awk -F: '$1 == "sec" {print $5}')

if [ -z "$KEYID" ]
then
    echo "\$KEYID is empty"
    exit
else
    git config --global user.signingkey $KEYID
    git config --global commit.gpgsign true

    echo "Hello, a caesar developer!" | gpg --clearsign
fi

