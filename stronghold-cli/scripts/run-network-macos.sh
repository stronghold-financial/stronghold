#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
cd ..

# This script boots up 3 nodes and has them connect to each other
# node1 uses ~/.stronghold1 @ 9032
# node2 uses ~/.stronghold2 @ 9033; connects to node1
# node3 uses ~/.stronghold3 @ 9034; connects to node2

if [ ! "$(command -v "osascript")" ]; then
  echo 'Your computer does not have osascript (Apple Script) installed'
  exit 1
fi

rm -rf ~/.stronghold1/databases
rm -rf ~/.stronghold2/databases
rm -rf ~/.stronghold3/databases

CWD="$(pwd)"
NODE1="yarn start:once start -v -p 9034 -w -n peer1 -b localhost:9033 --datadir ~/.stronghold1"
NODE2="yarn start:once start -v -p 9035 -w -n peer2 -b localhost:9033 --datadir ~/.stronghold2 --no-listen"
NODE3="yarn start:once start -v -p 9036 -w -n peer3 -b localhost:9033 --datadir ~/.stronghold3 --no-listen"
NODE2_LIST="yarn start:once peers:list -fenas --datadir ~/.stronghold1"

osascript <<END
  tell application "Terminal"
    activate
    do script "cd $CWD && $NODE1" in selected tab of the front window
    delay 0.5
    activate
  end tell

  tell application "System Events"
    tell process "Terminal" to keystroke "t" using command down
  end tell

  tell application "Terminal"
    do script "cd $CWD && $NODE2" in selected tab of the front window
    delay 0.5
    activate
  end tell

  tell application "System Events"
    tell process "Terminal" to keystroke "t" using command down
  end tell

  tell application "Terminal"
    activate
    do script "cd $CWD && $NODE3" in selected tab of the front window
    delay 0.5
    activate
  end tell

  tell application "System Events"
    tell process "Terminal" to keystroke "t" using command down
  end tell

  tell application "Terminal"
    activate
    do script "cd $CWD && $NODE2_LIST" in selected tab of the front window
  end tell
END
