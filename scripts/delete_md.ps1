param([string]$Root = 'C:\Users\33787\Downloads\projetweb\pojet-dev-web')

Get-ChildItem -Path $Root -Recurse -Include *.md | Where-Object { $_.Name -ne 'README.md' } | ForEach-Object {
    Remove-Item -LiteralPath $_.FullName -Force -ErrorAction SilentlyContinue
    Write-Output "Deleted: $($_.FullName)"
}

Write-Output 'Remaining .md files:'
Get-ChildItem -Path $Root -Recurse -Include *.md | ForEach-Object { Write-Output $_.FullName }
