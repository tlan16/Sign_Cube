@echo off
:: Remove Existing databases
c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot -e "DROP DATABASE IF EXISTS signcube"

:: Create new databases
c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot -e "CREATE DATABASE `signcube` DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci"
Pause

:: Import sql file
"S:\Program Files\7-Zip\7z.exe" x -so signcube_after_bsl.7z | c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot signcube
::c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot signcube < .\structure.sql
::c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot signcube < .\userAccount.sql
::c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot signcube < .\data.sql
::c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot signcube < .\thirdparty_bsl.sql
::c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot signcube < .\language.sql
::c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot signcube < .\category.sql
::c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot signcube < .\postUserAccount.sql
::c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot signcube < .\frank_laptop.sql

Pause