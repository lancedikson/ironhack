#!/bin/sh

TMPDIR=build_tmp

rm -rf $TMPDIR
mkdir -p $TMPDIR

git clone git@github.com:sorgoz/ironhack.git $TMPDIR

rm -f videoly-ironhack.zip
cd $TMPDIR/addon

zip -rv -0 ../../videoly-ironhack.zip .

cd ../../
rm -rf $TMPDIR
