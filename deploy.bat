@echo off
echo ===================================================
echo   Deploy Shijitha Jenifer J Portfolio to GitHub
echo ===================================================
echo.
echo Please create a new GitHub repository at:
echo https://github.com/new
echo (Repository name: shijithajenifer.github.io OR portfolio)
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/shijithajenifer/portfolio.git): "

if "%REPO_URL%"=="" (
    echo No URL provided. Aborting.
    pause
    exit /b
)

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
git add .
git commit -m "Deploy latest portfolio updates" 2>nul
echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ===================================================
echo   Code pushed successfully!
echo   Next Step: Enable GitHub Pages
echo   1. Go to your repo on GitHub: %REPO_URL%
echo   2. Click "Settings" -> "Pages"
echo   3. Under "Branch", select "main" -> "/ (root)" -> Save
echo   Your website will be live in 1-2 minutes!
echo ===================================================
pause
