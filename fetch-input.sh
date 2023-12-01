#!/usr/bin/env bash

die (){ echo "$@"; exit 1; }

[[ -z "$1" ]] && die "Usage: fetch-input [day]"

DAY="$1"
FILE="data/$DAY-input.txt"
URL="https://adventofcode.com/2023/day/${DAY#0}/input"

[[ -d "$1" ]] || die "Invalid day"
[[ -f "$FILE" ]] && die "Already downloaded"

[[ -f "KEYS.sh" ]] || die "Missing KEYS.sh

It should have a single variable:

AOC_SESSION=....

where the value is the session cookie that can be found
by inspecting network requests once logged in."

source KEYS.sh
[[ -z "$AOC_SESSION" ]] && die "Missing AOC_SESSION variable in KEYS.sh."

CONTENTS="$(curl --fail -H "cookie: session=${AOC_SESSION}" "$URL")"

[[ -z "$CONTENTS" ]] && die "Failed to get input"
mkdir -p data
echo "$CONTENTS" > "$FILE"

