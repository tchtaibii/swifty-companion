#!/bin/bash

command_exists () {
    command -v "$1" >/dev/null 2>&1
}

#!/bin/bash

set -e

echo "Checking if adb is installed..."
if command -v adb &> /dev/null; then
  echo "adb is installed."
else
  echo "adb is NOT installed."
fi

# Detect OS type for correct download link
OS_TYPE=$(uname -s)
if [[ "$OS_TYPE" == "Linux" ]]; then
  SDK_URL="https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip"
elif [[ "$OS_TYPE" == "Darwin" ]]; then
  SDK_URL="https://dl.google.com/android/repository/commandlinetools-mac-9477386_latest.zip"
else
  echo "Unsupported OS: $OS_TYPE"
  exit 1
fi

ANDROID_ROOT="$HOME/Android"
CMDLINE_TOOLS_DIR="$ANDROID_ROOT/cmdline-tools/latest"

# Function to check if SDK exists
function sdk_exists() {
  [ -d "$ANDROID_ROOT/platform-tools" ] && [ -d "$CMDLINE_TOOLS_DIR" ]
}

if [ -z "$ANDROID_HOME" ]; then
  if sdk_exists; then
    export ANDROID_HOME="$ANDROID_ROOT"
    echo "Found existing Android SDK at $ANDROID_HOME"
  else
    echo "Android SDK not found. Installing to $ANDROID_ROOT ..."
    mkdir -p "$ANDROID_ROOT"

    TMP_ZIP="/tmp/cmdline-tools.zip"
    echo "Downloading Android command line tools..."
    curl -o "$TMP_ZIP" -L "$SDK_URL" || { echo "Download failed"; exit 1; }

    mkdir -p "$ANDROID_ROOT/cmdline-tools"
    rm -rf "$CMDLINE_TOOLS_DIR"

    echo "Extracting..."
    unzip -q "$TMP_ZIP" -d "$ANDROID_ROOT/cmdline-tools"

    # Move extracted folder to 'latest'
    mv "$ANDROID_ROOT/cmdline-tools/cmdline-tools" "$CMDLINE_TOOLS_DIR"

    rm "$TMP_ZIP"

    export ANDROID_HOME="$ANDROID_ROOT"
    echo "Android command line tools installed at $CMDLINE_TOOLS_DIR"

    # Add to PATH temporarily
    export PATH="$CMDLINE_TOOLS_DIR/bin:$ANDROID_HOME/platform-tools:$PATH"

    echo "Installing platform-tools (adb)..."
    yes | sdkmanager --sdk_root="$ANDROID_HOME" "platform-tools" >/dev/null

    echo "Android SDK platform-tools installed."
  fi
else
  echo "ANDROID_HOME is set to $ANDROID_HOME"
fi

# Ensure platform-tools path is in PATH
export PATH="$ANDROID_HOME/platform-tools:$PATH"

echo "Checking if adb is installed..."

if ! command_exists adb ; then
  echo "adb not found."

  if command_exists apt-get ; then
    echo "Attempting to install adb (this may require sudo)..."
    if [ "$(id -u)" -ne 0 ]; then
      echo "You need to run this script with sudo to install adb or install it manually."
      echo "Exiting."
      exit 1
    else
      apt-get update && apt-get install -y adb
      if [ $? -ne 0 ]; then
        echo "Failed to install adb."
        exit 1
      fi
    fi
  else
    echo "No supported package manager found to install adb automatically."
    echo "Please install adb manually."
    exit 1
  fi
else
  echo "adb is installed."
fi

# Check if ANDROID_HOME is set
if [ -z "$ANDROID_HOME" ]; then
  echo "ANDROID_HOME environment variable is not set. Attempting to locate Android SDK..."

  # Common default Android SDK locations
  SDK_PATHS=(
    "$HOME/Android/Sdk"
    "$HOME/Android/sdk"
    "/usr/lib/android-sdk"
    "/usr/local/android-sdk"
  )

  FOUND_SDK=""

  for path in "${SDK_PATHS[@]}"; do
    if [ -d "$path" ]; then
      FOUND_SDK="$path"
      break
    fi
  done

  if [ -z "$FOUND_SDK" ]; then
    echo "Could not find Android SDK in common locations."
    echo "Please install the Android SDK and set ANDROID_HOME environment variable."
    echo "Example:"
    echo "  export ANDROID_HOME=~/Android/Sdk"
    exit 1
  else
    export ANDROID_HOME="$FOUND_SDK"
    export PATH="$ANDROID_HOME/platform-tools:$PATH"
    echo "Found Android SDK at $ANDROID_HOME"
  fi
else
  echo "ANDROID_HOME is set to $ANDROID_HOME"
  export PATH="$ANDROID_HOME/platform-tools:$PATH"
fi

echo "Waiting for Android device to be connected via USB..."

while true; do
  devices=$(adb devices | grep -w "device")
  if [ -n "$devices" ]; then
    echo "Device detected: $devices"
    break
  else
    echo "No devices detected. Please connect your Android device via USB."
    sleep 3
  fi
done

echo "Setting up port forwarding with adb reverse..."

adb reverse tcp:8081 tcp:8081
if [ $? -ne 0 ]; then
  echo "adb reverse failed. Make sure your device supports reverse port forwarding."
  exit 1
fi

echo "Starting Expo with host localhost..."

npx expo start --host localhost