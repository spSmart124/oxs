#Requires -Version 5.0

<# 
    .SYNOPSIS
    This is used to configure app properties

    .DESCRIPTION
    This is used to configure app properties

    .EXAMPLE
    .\Configure-AppProperties.ps1 "vfl_spradhan" "$VFL_WORK" "$VFL_CONF" "application.properties"
    .\Configure-AppProperties.ps1 "$APP_NAME" "$VFL_WORK" "$VFL_CONF" "$SERVER_CONF_FILE"
 #>
 

param(
    [Parameter(Mandatory = $false)]
    [string]
    $appName = "vfl_$env:username",
    [ValidateScript(
        { 
            if (Test-Path -Path "$_") {
                $true
            } else {
                throw "The directory $_ does not exist."
            }
         }
    )]
    [Parameter(Mandatory = $false)]
    [string]
    $appWorkPath = "$env:OneDrive\VFLApp\work\",
    [ValidateScript(
        { 
            if (Test-Path -Path "$_") {
                $true
            } else {
                throw "The directory $_ does not exist."
            }
         }
    )]
    [Parameter(Mandatory = $false)]
    [string]
    $propertiesPath = "$env:OneDrive\VFLApp\conf",
    [Parameter(Mandatory = $false)]
    [string]
    $propertiesFile = "application.properties"
)

# $OutputEncoding = [System.Text.UTF8Encoding]::new()

# $appWorkPath = "$1"
# Write-Host "Dollar 1: $1"
Write-Debug "appWorkPath: $appWorkPath"
$doubleSlashReplacedAppWorkPath = "$appWorkPath" -replace '\\', '\\'
$hashProperties = @{
# "spring.application.name"="vfl"
"spring.application.name"="$appName"
# "app.work.path"="C:\\Users\\srpradhan\\Desktop\\Work\\CAI\\"
"app.work.path"="$doubleSlashReplacedAppWorkPath"
# "app.work.path"="$appWorkPath"
"template.file.start"="case"
"template.file.end"="pointer"
"template.file.delimiter"="-"
"template.file.extension"=".txt"

#Application name in the OS used to open folder created
"app.file.explorer.application"="Explorer.exe"
#Application name in the OS used to open file created in an editor
"app.file.editor.application"="notepad++.exe"
}

Write-Debug $hashProperties

$hashPropertiesWithIndex = @()

$index = 0
$hashProperties.GetEnumerator() | Foreach-Object {
    # $hashPropertiesWithIndex.Add($index, @{$_.Key, $_.Value})
    $property = $_.Key
    $value = $_.Value
    $hashPropertiesWithIndex += [PSCustomObject]@{
        "Index" = $index
        "Property" = "$property"
        "Value" = "$value"
    }
    $index++
}

$hashPropertiesWithIndex | Format-Table

$promptMessage = "Choose an index to modify in the application property from the above list. " + 
"Press Enter to finish modification or accept defaults"
while($inputIndex = Read-Host $promptMessage) {
    Write-Debug "inputIndex: $inputIndex"

    $intCastedIndex = [int]$inputIndex
    if ($intCastedIndex -lt 0 -or $intCastedIndex -gt $hashPropertiesWithIndex.Count) {
        Write-Host "The value [$inputIndex] is invalid. Please enter an integer value between 0 and $($hashPropertiesWithIndex.Count)"
        continue
    }

    $hashSelected = $hashPropertiesWithIndex[$intCastedIndex]
    # Write-Debug "hashSelected: $hashSelected"
    # $hashSelected.Property
    # "string" | Get-Member
    # $propertySelected = $hashSelected['Property']
    $propertySelected = $hashSelected.Property
    Write-Debug "propertySelected: $propertySelected"
    $inputValue = Read-Host "Enter a new value for the property [$propertySelected] at index $inputIndex"
    $hashSelected.Value = $inputValue
    Write-Host "New value of the property selected is as below."
    $hashSelected | Format-Table
    $hashPropertiesWithIndex | Format-Table
}

# $hashPropertiesWithIndex | Format-Table
# Write-Host "$propertiesPath\$propertiesFile"
# "" > "$propertiesPath\$propertiesFile"

Remove-Item -Path $propertiesPath\$propertiesFile -ErrorAction SilentlyContinue
foreach ($hash in $hashPropertiesWithIndex) {
    Add-Content -Path $propertiesPath\$propertiesFile -Encoding UTF8 -Value "$($hash.Property + '=' + $hash.Value)"
}
