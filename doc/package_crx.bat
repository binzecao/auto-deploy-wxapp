rem ������chrome���

@echo off

:: ��ȡ��һ��Ŀ¼·��
set currPath=%~dp0
set parentPath=
:begin
FOR /F "tokens=1,* delims=\" %%i IN ("%currPath%") DO (set front=%%i)
FOR /F "tokens=1,* delims=\" %%i IN ("%currPath%") DO (set currPath=%%j)
if not "%parentPath%" == "" goto gotJpdaOpts
:gotJpdaOpts
if "%parentPath%%front%\"=="%~dp0" goto end
set parentPath=%parentPath%%front%\
goto begin
:end
::echo %parentPath%

:: �������crx�ļ�
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --pack-extension="%parentPath%\crx" --pack-extension-key="%parentPath%\key.pem"
