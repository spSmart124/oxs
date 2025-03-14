@ECHO OFF

SET SCRIPT_PATH=%~dp0
SET LTS_HOME=%SCRIPT_PATH%..
SET LTS_JAVA_HOME=%LTS_HOME%\java\jre\zulu17.52.17-ca-jre17.0.12-win_i686

SET VFL_HOME=%~1
SET LTS_JAVAW=%~2
SET LTS_LIB=%~3
SET LTS_APP_JAR=%~4
SET VFL_CONF=%~5
SET SERVER_CONF_FILE=%~6
SET VFL_LOG=%~7
SET VFL_SERVER_LOG_FILE=%~8

IF "%VFL_HOME%"=="" SET VFL_HOME=%OneDrive%\VFLApp
@REM ECHO VFL_HOME: %VFL_HOME%

IF "%LTS_JAVAW%"=="" SET LTS_JAVAW=%LTS_JAVA_HOME%\bin\javaw.exe
@REM ECHO LTS_JAVAW: %LTS_JAVAW%

IF "%LTS_LIB%"=="" SET LTS_LIB=%LTS_HOME%\java\lib
@REM ECHO LTS_LIB: %LTS_LIB%

IF "%LTS_APP_JAR%"=="" SET LTS_APP_JAR=vfl-0.0.1-SNAPSHOT.jar
@REM ECHO LTS_APP_JAR: %LTS_APP_JAR%

IF "%VFL_CONF%"=="" SET VFL_CONF=%VFL_HOME%\conf
@REM ECHO VFL_CONF: %VFL_CONF%

IF "%SERVER_CONF_FILE%"=="" SET SERVER_CONF_FILE=application.properties
@REM ECHO SERVER_CONF_FILE: %SERVER_CONF_FILE%

IF "%VFL_LOG%"=="" SET VFL_LOG=%VFL_HOME%\log
@REM ECHO VFL_LOG: %VFL_LOG%

IF "%VFL_SERVER_LOG_FILE%"=="" SET VFL_SERVER_LOG_FILE=vfl_server.log
@REM ECHO VFL_SERVER_LOG_FILE: %VFL_SERVER_LOG_FILE%


"%LTS_JAVAW%" -jar "%LTS_LIB%\%LTS_APP_JAR%" --spring.config.location="%VFL_CONF%\%SERVER_CONF_FILE%" >> "%VFL_LOG%\%VFL_SERVER_LOG_FILE%" 2>&1

EXIT /B 0