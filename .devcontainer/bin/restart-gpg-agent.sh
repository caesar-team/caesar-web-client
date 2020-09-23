#!/bin/sh

# restarts the gpg-agent
# often necessary because it is so faulty program

killall gpg-agent || true
gpg-agent --daemon