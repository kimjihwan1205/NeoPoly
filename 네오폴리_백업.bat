@echo off
chcp 65001
echo ====== 깃허브 백업을 시작합니다 ======

:: 1. 오늘 날짜와 시간 가져오기
set CURRENT_DATE=%date% %time%

:: 2. 변경된 모든 파일 고르기
git add .

:: 3. 오늘 날짜를 이름표로 붙여서 기록하기
git commit -m "자동 백업: %CURRENT_DATE%"

:: 4. 깃허브(인터넷)로 업로드하기
git push

echo ====== 백업이 완료되었습니다 ======
pause