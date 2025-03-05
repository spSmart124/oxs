#Requires -Version 5.0

[CmdletBinding()] param ()

Set-Location -Path $PSScriptRoot
. .\Env.ps1

Write-Host "`$LTS_JAVAW: $LTS_JAVAW"
$fullPath = (Get-ChildItem -Path "$LTS_JAVAW").FullName
Write-Host "`$fullPath: $fullPath"
$vflJavaProcessId = (Get-Process | Where-Object {$_.Path -eq "$fullPath"}).Id

Write-Host "`$vflJavaProcessId: $vflJavaProcessId"

Stop-Process -Id "$vflJavaProcessId" -Confirm -PassThru