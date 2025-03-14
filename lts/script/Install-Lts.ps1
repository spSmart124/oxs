#Requires -Version 5.0

<# 
    .AUTHOR
    Sribatsa Pradhan

    .SYNOPSIS
    This is used to install the application

    .DESCRIPTION
    This is used to install the application. It will setup the environment appropriately.

#>

Write-Host "Installing local template server (lts)..."
$vflInstallationPath = Read-Host "Enter a path to install VFL application [Press Enter to accept default: $env:OneDrive]"

# Configuring application installation path
if ($vflInstallationPath.Trim().Length -eq 0) {
    $vflInstallationPath = "$env:OneDrive"
    # .\env.ps1 "$vflInstallationPath"
} elseif (Test-Path -Path "$vflInstallationPath") {
    $true
} else {
    Write-Error "$vflInstallationPath does not exist. Exiting ..."
    EXIT 127
}

# Setting environment variables
Set-Location -Path $PSScriptRoot
. .\Env.ps1 "$vflInstallationPath"

# Create folder structure for the application.
Write-Host "Creating folder structure for the application..."
Write-Host "Creating folder for application $APP_NAME..."
if (Test-Path -Path  "$VFL_HOME") {
    Write-Host "The directory $VFL_HOME is already present. Skip creating this directory."

    if (Get-ChildItem "$VFL_HOME") {
        Write-Error "The directory $VFL_HOME is not empty. Please choose a empty directory to proceed. Exiting ..."
        EXIT 127
    } else {
        $paths = @("$VFL_WORK", "$VFL_LOG", "$VFL_CONF")
    }
} else {
    $paths = @("$VFL_HOME", "$VFL_WORK", "$VFL_LOG", "$VFL_CONF")
}

Foreach ( $path in $paths ) {
    New-Item -ItemType Directory -Path "$path"
}

Write-Host "Configuring application properties for local template server ..."
# Configure java application properties file
.\Configure-AppProperties.ps1 "$APP_NAME" "$VFL_WORK" "$VFL_CONF" "$SERVER_CONF_FILE"


Write-Host "Creating a shortcut to startup path for local template server start command ..."
# Create a short cut to the VFL app server and add it to System startup path for starting up the server after reboot.
$winStartupProgramPath = [System.Environment]::GetFolderPath('Startup')
$shortcutFile = "$winStartupProgramPath\$LTS_SERVER_START_COMMNAD-shortcut.lnk"
$shell = New-Object -comObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutFile)
$shortcut.TargetPath = "$SCRIPT_PATH\$LTS_SERVER_START_COMMNAD"
$shortcut.WindowStyle = 7 # It will open a minimized window
$shortcut.WorkingDirectory = $VFL_LOG

$arguments = @($VFL_HOME)
$doubleQuoteSpaceSeparateArguments = $($arguments | ForEach-Object {'"' + $_ + '"'}) -Join ' '
$shortcut.Arguments = $doubleQuoteSpaceSeparateArguments
$shortcut.Save()


Write-Host "Starting local template server ..."
Write-Host "You can close this command console"
.\server_start.cmd "$VFL_HOME"
