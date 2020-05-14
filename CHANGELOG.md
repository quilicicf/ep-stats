# Changelog

* __2.0.1:__
  * :triangular_ruler: Store OCR trained data in ep-stats' configuration folder
* __2.0.0:__ 
  * :new: Add a special command to initialize the Google authentication instead of a npm script
  * :up: Switch to non-interactive process by pulling the screenshots from Google Photos API
  * :bug: Lots of fixes for better results
  * :memo: The tool now auto-documents itself with `ep-stats --help`
  * :memo: Better documentation
  * :triangular_ruler: The configuration files are now in a single configuration folder `~/.config/ep-stats`
  * :sound: Improved logs to handle parsing errors
  * :sound: Logs are now written to a log file in the configuration folder
  * :shower::checkered_flag::apple: Removed all external dependencies to only keep NodeJS
  * :rotating_light: There are breaking changes, follow instructions below to migrate
    * Run `ep-stats initialize` to re-initialize the tool (the Google authentication files changed places)
    * Use `ep-stats run` to run the tool from now on
* __1.0.0:__ Initial version
