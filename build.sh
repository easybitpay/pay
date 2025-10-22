#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR;

git pull origin main

npm i --force

npm run build
if [ -d "dist" ]; then
    echo "Build Successfull."

    if [ -d "web.backup" ]; then
        rm -rf web.backup
    fi
    mv web web.backup
    mv dist web
    cd web
    ln -s ../../files/apps
    ln -s ../../files/documents
    ln -s ../../files/merchants
    ln -s ../../files/tokens
    ln -s ../../files/icons
    #ln -s ../../files/media  
    ln -s ../../files/tickets
else
    echo "Dist directory does not exist."
    echo "Failed to build."
fi
