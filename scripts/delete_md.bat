@echo off
set ROOT=C:\Users\33787\Downloads\projetweb\pojet-dev-web
for /r "%ROOT%" %%f in (*.md) do (
  if /I not "%%~nxf"=="README.md" (
    echo Deleting %%f
    del "%%f"
  )
)
echo Remaining .md files:
dir /s /b "%ROOT%\*.md"
