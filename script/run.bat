@ECHO OFF

if /i "%1" == "" GOTO :newwin
if /i "%1" == "-nowin" GOTO :nowin

:newwin
start cmd /C nodemon server.mjs
exit

:nowin
nodemon server.mjs
exit