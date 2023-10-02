#!/bin/bash

# This script creates symlinks for the external dependencies of the library
# in the node_modules directory of the consumer project.
# You can use this command to develop the library using a local laravel project
# as a consumer. This way you can test the library in the context of the consumer
# project without having to publish it to npm.

# Usage: ./link_external_deps.sh <path_to_consumer_project>
# Example: ./link_external_deps.sh /var/www/html/my-laravel-project

# To actually link the projects, you need to run this command in the library directory
# (where this script is located)
# npm link
# Then, in the consumer project directory, run
# npm link @arandu/laravel-mui-admin

# Specify your dependencies
declare -a dependencies=("axios"
                         "i18next"
                         "i18next-browser-languagedetector"
                         "lodash"
                         "react"
                         "react-dom"
                         "react-i18next"
                         "react-router-dom"
                         "uuid"
                         "@mui"
                         "@emotion")

# Get the argument - path to the consumer project
consumer_project_path=$1

# Path to the node_modules directory of the consumer project
node_modules_path="$consumer_project_path/node_modules"

# Loop over dependencies and create symlinks for each one
for dep in "${dependencies[@]}"
do
   echo "Linking $dep"
   rm -rf "node_modules/$dep"
   ln -s "$node_modules_path/$dep" "node_modules/$dep"
done