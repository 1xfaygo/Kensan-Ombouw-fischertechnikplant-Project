@echo off

cd /d "%~dp0frontend\Kensan"
start cmd /k "npm run dev"

cd /d "%~dp0backend"
start cmd /k "npm run dev"
