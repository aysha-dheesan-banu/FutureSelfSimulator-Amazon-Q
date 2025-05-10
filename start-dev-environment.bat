@echo off
echo Starting FutureStimulus Development Environment...

rem Start local DynamoDB
echo Starting local DynamoDB...
call start-local-dynamodb.bat

rem Wait a moment for DynamoDB to start
timeout /t 5 /nobreak >nul

rem Start the development server
echo Starting development server...
call npm run dev

pause