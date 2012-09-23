#/bin/bash

if [ ! -n "$BUILD_NUMBER" ]; then
    export BUILD_NUMBER=$1
fi

if [ ! -n "$RELEASE_NUMBER" ]; then
    export RELEASE_NUMBER=$2
fi

export RPM_TOPDIR=`rpm --eval '%{_topdir}'`

cd ../
phing build-prod
