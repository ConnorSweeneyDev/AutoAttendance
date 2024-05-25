# AutoAttendance
Developed by: Myself and [Luke Britton](https://github.com/lukewb21).\
A program that connects to the university's attendance website and checks periodically for new lectures, then automatically attends them.

## Dependencies
- Google Chrome &rightarrow; [Chrome](https://www.google.com/chrome) must be installed to `C:/Program Files/Google/Chrome/Application/chrome.exe`, or change line 46 of `server.mjs` to match your install.
- NodeJS &rightarrow; Run `winget install OpenJS.NodeJS`. This includes npm.
- puppeteer &rightarrow; Run `npm install puppeteer` in the project directory.
- puppeteer-extra &rightarrow; Run `npm install puppeteer-extra` in the project directory.
- puppeteer-extra-plugin-stealth &rightarrow; Run `npm install puppeteer-extra-plugin-stealth` in the project directory.
- readline &rightarrow; Run `npm install readline` in the project directory.
- fs &rightarrow; Run `npm install fs` in the project directory.
- chalk &rightarrow; Run `npm install chalk` in the project directory.
- nodemon &rightarrow; Run `npm install -g nodemon` in any directory.

## Usage
After cloning just run `system/run.bat` from the project directory and sign in, you can save your credentials for future use.
