#!/usr/bin/env bash

main() {
  local filePath="${1?Missing file path}"

  local croppedFilePath='/tmp/cropped.png'
  local finalFilePath='/tmp/final.png'

  convert -size 1536x2048 -depth 8 -extract 500x100+500+0 "$filePath" "$croppedFilePath"

  convert \
    "$croppedFilePath" \
    -write mpr:P1 \
    +delete \
    -respect-parentheses \
      \( mpr:P1 -threshold 90% -negate                          +write /tmp/final.png \) \
      null:
#      \( mpr:P1 -fuzz 10% -fill white -opaque '#BBD7F0'         +write mpr:P2 \) \
#      \( mpr:P2 -fuzz 2% -fill white -opaque '#020708'          +write mpr:P3 \) \

  tesseract "$finalFilePath" stdout -psm 11

  xdg-open "$finalFilePath" &
}

main "$@"
