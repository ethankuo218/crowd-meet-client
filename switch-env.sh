#!/bin/bash

ENV=$1

if [ -z "$ENV" ]; then
    echo "No environment set. Use 'dev', 'sit' or 'prod'."
    exit 1
fi

if [ "$ENV" != "dev" ] && [ "$ENV" != "sit" ] && [ "$ENV" != "prod" ]; then
    echo "Invalid environment '$ENV'. Use 'dev', 'sit' or 'prod'."
    exit 1
fi

# Check if files exist
if [ ! -f env/$ENV/android/strings.xml ]; then
    echo "Error: File env/$ENV/android/strings.xml does not exist!"
    exit 1
fi

if [ ! -f env/$ENV/android/google-services.json ]; then
    echo "Error: File env/$ENV/android/google-services.json does not exist!"
    exit 1
fi

# Check if the iOS files for the specified environment exist
if [ ! -f env/$ENV/ios/Info.plist ]; then
    echo "Error: File env/$ENV/ios/Info.plist does not exist!"
    exit 1
fi

echo "Switching to environment '$ENV'..."

# copy the files
cp env/$ENV/android/strings.xml android/app/src/main/res/values/strings.xml
cp env/$ENV/android/google-services.json android/app/google-services.json
cp env/$ENV/ios/Info.plist ios/App/App/Info.plist

echo "Environment '$ENV' set successfully."
