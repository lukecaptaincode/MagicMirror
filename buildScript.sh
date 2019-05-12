#!/usr/bin/env bash
echo "Build for( Will delete the contents of build): [1]Win, [2]Mac, [3]Linux, [4]All, [5]RPI"
read os
# Based on build, call each build script after emptying the directory of previous build scripts of that type
case "$os" in
    "1")
        rm -rfv build/*_win32_*
        echo "Deleted old version"
        electron-packager ./ $(npm run name --silent)-$(npm run version --silent) --platform=win32 --arch=x64 --out=build --asar=false
    ;;
    "2")
          rm -rfv build/*_darwin_*
        echo "Deleted old version"
        electron-packager ./ $(npm run name --silent)-$(npm run version --silent) --platform=darwin --arch=x64 --out=build --asar=false
    ;;
    "3")
          rm -rfv build/*_linux_*
        echo "Deleted old version"
        electron-packager ./ $(npm run name --silent)-$(npm run version --silent) --platform=linux --arch=x64 --out=build --asar=false
    ;;
    "4")
          rm -rfv build/*
        echo "Deleted old version"
        electron-packager ./ $(npm run name --silent)-$(npm run version --silent) --platform=all --arch=x64 --out=build --asar=false
    ;;
    "5")
          rm -rfv build/*
        echo "Deleted old version"
        electron-packager ./ $(npm run name --silent)-$(npm run version --silent) --platform=linux --arch=armv7l --out=build --asar=false
    ;;
    *)
    echo "Invalid selection, goodbye"
    ;;
esac