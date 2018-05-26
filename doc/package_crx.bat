rem 命令打包chrome插件

@echo off

:: 获取上一级目录路径
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

:: 打包生成crx文件
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --pack-extension="%parentPath%\crx" --pack-extension-key="%parentPath%\key.pem"
