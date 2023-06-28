#!/bin/bash

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