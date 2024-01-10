@echo off
setlocal enabledelayedexpansion

:: Usage: .\link_external_deps.bat "<path_to_consumer_project>""
:: Example: .\link_external_deps.bat "C:\path\to\my-laravel-project"

:: To actually link the projects, you need to run this command in the library directory
:: (where this script is located)
:: npm link
:: Then, in the consumer project directory, run
:: npm link @arandu/laravel-mui-admin

:: Specify your dependencies
set dependencies=axios i18next i18next-browser-languagedetector lodash react react-dom react-i18next react-router-dom uuid @babel @mui @emotion

:: Get the argument - path to the consumer project
set consumer_project_path=%1

:: Path to the node_modules directory of the consumer project
set node_modules_path=%consumer_project_path%\node_modules

:: Loop over dependencies and create symlinks for each one
for %%d in (%dependencies%) do (
    echo Linking %%d
    if exist "node_modules\%%d" (
        rmdir /s /q "node_modules\%%d"
    )
    mklink /D "node_modules\%%d" "%node_modules_path%\%%d"
)

endlocal