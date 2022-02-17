@ECHO OFF

IF %1.==. GOTO No1
IF %2.==. GOTO No2

set arg1=%1
set arg2=%2
node --experimental-loader ./http-loader.mjs ./server.js --game %arg1% --world %arg2%
GOTO End1

:No1
  ECHO Missing Game Path, Ex: "./../games/test"
GOTO End1
:No2
  ECHO Missing World Name, Ex: "worlds/world.json"
GOTO End1

:End1

