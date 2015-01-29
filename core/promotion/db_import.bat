@echo off
:: Remove Existing databases
c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot -e "DROP DATABASE IF EXISTS signcube
Pause

:: Create new databases
c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot -e "CREATE DATABASE `signcube` DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci"
Pause

:: Import sql file
c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot signcube < .\structure.sql
Pause
c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot signcube < .\data.sql
Pause
c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot signcube < .\auslan.sql
Pause
c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot signcube < .\language.sql
Pause
c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot signcube < .\category.sql
Pause
#c:\wamp\bin\mysql\mysql5.6.17\bin\mysql.exe -u root -proot signcube < .\frank_laptop.sql
#Pause