# Reserve Tennis Courts in SF!

- [ ] Check if we can book for 10/30/2019 at midnight.

## Use `crontab`

https://crontab.guru

Every wednesday at midnight:

0 0 * * 3 sh /Users/chet/Code/js/tennis-sf/run.sh

## Use `at`

man at
man atrun
sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.atrun.plist
echo "sh run.sh" | at 00:14