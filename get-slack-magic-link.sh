#!/bin/bash

export SLACK_WORKSPACE=<workspacename>
export SLACK_EMAIL=john.doe@example.com
export SLACK_PASSWORD="$(gopass show -o path/to/slack/john.doe@example.com)"
export SLACK_OTP="$(gopass otp -o path/to/slack/john.doe@example.com)"

exec npx --unhandled-rejections=strict -q get-slack-magic-link@.
