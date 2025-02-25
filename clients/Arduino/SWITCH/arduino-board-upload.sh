#!/bin/bash

# Initialize variables
profile_value="uno"

# Parse command-line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --profile)
            shift
            profile_value="$1"
            shift
            ;;
        *)
            echo "Unknown parameter: $1"
            exit 1
            ;;
    esac
done

# Get the output of 'arduino-cli board list'
arduino_output=$(arduino-cli board list)

# Check if 'fzf' is installed
if ! command -v fzf &> /dev/null; then
    echo "Error: 'fzf' is not installed. Please install it before running this script."
    exit 1
fi

# Use 'fzf' to let the user select a line
selected_line=$(echo "$arduino_output" | fzf --height=20 --layout=reverse --info=inline --cycle)

# Parse the selected line to get the port value and FQBN
selected_port=$(echo "$selected_line" | awk '{print $1}')

echo "Selected Port: $selected_port"
echo "Profile Value: $profile_value"

# Compile the sketch
echo "Compiling and uploading the sketch..."
arduino-cli compile --profile "$profile_value"

# Upload the sketch
echo "Uploading the sketch..."
arduino-cli upload --port "$selected_port" --profile "$profile_value"
