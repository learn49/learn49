#!/bin/bash

echo "Checking changes in $1"

OUTPUT=`git diff HEAD^ HEAD --raw -- ./`
LEN=${#OUTPUT}

if (("$LEN" > 0)) ; then
  # Proceed with the build
    echo "✅ - Build can proceed"
  exit 1;

else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi