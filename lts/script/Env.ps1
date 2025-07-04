param(
    [string] $vflInstallationPath
)

Set-Variable SCRIPT_PATH -Option Constant -Value "$PSScriptRoot"
Set-Variable LTS_HOME -Option Constant -Value "$SCRIPT_PATH\.."
Set-Variable LTS_CONF -Option Constant -Value "$LTS_HOME\conf"
Set-Variable LTS_JAVA_HOME -Option Constant -Value "$LTS_HOME\java\jre\zulu17.52.17-ca-jre17.0.12-win_i686"
Set-Variable LTS_JAVAW -Option Constant -Value "$LTS_JAVA_HOME\bin\javaw.exe"
Set-Variable LTS_LIB -Option Constant -Value "$LTS_HOME\java\lib"
Set-Variable LTS_APP_JAR -Option Constant -Value "vfl-2025-2606-SNAPSHOT.jar"
Set-Variable LTS_SERVER_START_COMMNAD -Option Constant -Value "server_start.cmd"
Set-Variable VFL_HOME -Option Constant -Value "$vflInstallationPath\VFLApp"
Set-Variable VFL_WORK -Option Constant -Value "$VFL_HOME\work\" # \ at the end is required.
Set-Variable VFL_LOG -Option Constant -Value "$VFL_HOME\log"
Set-Variable VFL_INSTALL_LOG_FILE -Option Constant -Value "install.log"
Set-Variable VFL_SERVER_LOG_FILE -Option Constant -Value "vfl_server.log"
Set-Variable VFL_CONF -Option Constant -Value "$VFL_HOME\conf"
Set-Variable SERVER_CONF_FILE -Option Constant -Value "application.properties"
# $SERVER_CONF_TEMPLATE_FILE -Option Constant -Value "application.properties.template"
Set-Variable APP_NAME -Option Constant -Value "vfl_$env:username"