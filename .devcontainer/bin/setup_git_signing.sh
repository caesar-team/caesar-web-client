#!/bin/sh
KEYID=$(gpg --list-secret-keys --with-colons | awk -F: '$1 == "sec" {print $5}')

if [ -z "$KEYID" ]
then
    echo "\$KEYID is empty"
    exit
else
    git config --global user.signingkey $KEYID
    git config --global commit.gpgsign true

    echo "caesar" | gpg -q --batch --status-fd 1 --sign --local-user $KEYID --passphrase-fd 0 > /dev/null
fi

