@ECHO OFF

IF %1.==. GOTO No1
IF %2.==. GOTO No2
IF %3.==. GOTO No3

set arg1=%1
set arg2=%2
set arg3=%3
node --experimental-loader ./%arg1%-loader.mjs ./server.js --protocol %arg1% --game %arg2% --world %arg3%
GOTO End1

:No2
  ECHO Missing Protocol, Ex: "http"
GOTO End1
:No2
  ECHO Missing Game Path, Ex: "./../games/test"
GOTO End1
:No3
  ECHO Missing World Name, Ex: "worlds/world.json"
GOTO End1

:End1
