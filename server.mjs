import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import readline from 'readline';
import fs from 'fs';
import chalk from 'chalk';
import {setTimeout} from 'node:timers/promises';

// USE CHALK TO FORMAT CONSOLE OUTPUT //
// INPUT = YELLOW
// SUCCESS OUTPUT = GREEN
// FAIL OUTPUT = RED
// INFO = BLUE OR GREY
// OPERATIONS = WHITE

// GLOBALS //
const RHULattendanceURL = 'https://generalssb-prod.ec.royalholloway.ac.uk/BannerExtensibility/customPage/page/RHUL_Attendance_Student';
const titleXPath = '//*[@id="loginHeader"]/div';
const emailInputXPath = '//*[@id="i0116"]';
const nextButtonXPath = '//*[@id="idSIButton9"]';
const passwordInputXPath = '//*[@id="i0118"]';
const signInButtonXPath = '//*[@id="idSIButton9"]';
const verificationCodeXPath = '//*[@id="idRichContext_DisplaySign"]';
const staySignedInButtonXPath = '//*[@id="idSIButton9"]';
const registerAttendanceButton1XPath = '//*[@id="pbid-buttonFoundHappeningNowButtonsOneHere"]';
const registerAttendanceButton2XPath = '//*[@id="pbid-buttonFoundHappeningNowButtonsTwoHere"]';
const userFullNameXPath = '//*[@id="username"]/span';
const clockXPath = '//*[@id="jsTime"]';
const target = '01';
const lukeURL = 'https://github.com/lukewb21';
const lukeText = '@lukewb21';
let totalLectures = 0;

// only works in some terminals
const lukeLink = `\u001B]8;;${lukeURL}\u0007${lukeText}\u001B]8;;\u0007`;
const connorURL = 'https://www.github.com/connorsweeneydev';
const connorText = '@connorsweeneydev';
const connorLink = `\u001B]8;;${connorURL}\u0007${connorText}\u001B]8;;\u0007`;

const v = '1.5.5';

async function main() {
    puppeteer.use(StealthPlugin());

    const chrome = await puppeteer.launch({ 
        headless: 'new',
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    });

    const p = await chrome.createIncognitoBrowserContext();
    const page = await p.newPage();

    await page.goto(RHULattendanceURL);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true,
    });

    process.stdin.on('keypress', (_, key) => {
        if (key && key.ctrl && key.name == 'c') {
            process.exit();
        }
    });
    
    console.clear();
    console.log(chalk.blue("                        _                  _   _                 _                                  "));
    console.log(chalk.blue("             /\\        | |            /\\  | | | |               | |                                 "));
    console.log(chalk.blue("            /  \\  _   _| |_ ___      /  \\ | |_| |_ ___ _ __   __| | __ _ _ __   ___ ___             "));
    console.log(chalk.blue("           / /\\ \\| | | | __/ _ \\    / /\\ \\| __| __/ _ \\ '_ \\ / _` |/ _` | '_ \\ / __/ _ \\            "));
    console.log(chalk.blue("          / ____ \\ |_| | || (_) |  / ____ \\ |_| ||  __/ | | | (_| | (_| | | | | (_|  __/            "));
    console.log(chalk.blue("         /_/    \\_\\__,_|\\__\\___/  /_/    \\_\\__|\\__\\___|_| |_|\\__,_|\\__,_|_| |_|\\___\\___|            "));
    console.log("                                                                                                    ");
    console.log(chalk.bold("                  Version "+v+" by "+lukeLink+" and "+connorLink+" on GitHub                        "));
    console.log("                                                                                                    ");
    console.log("                                   Welcome to Auto Attendance!                                      ");
    console.log("           This program automates the process of logging attendance on campus connect.              ");
    console.log("                                                                                                    ");
    console.log("                       Simply sign in once and have your lectures registered                        ");
    console.log("                          for as long as you leave the program running!                             ");
    console.log("                                                                                                    ");
    console.log("                                                                                                    ");
    console.log(chalk.italic("       Disclaimer: This program should only be used on days you attend lectures. It is your         "));
    console.log(chalk.italic("     responsibility to ensure that you are attending the correct lectures. The author of this       "));
    console.log(chalk.italic("       program is not responsible for any missed lectures or the misuse of this application.        "));
    console.log(chalk.italic("                                                                                                    "));

    await new Promise(resolve => rl.question(chalk.yellow('                                     Press Enter to continue...                                  '), resolve));
    console.clear();

    // CHECK FOR EXISTING CREDENTIALS //
    let userEmail = '';
    let password = '';
    let useCredentials = false;
    
    // Check if credentials.txt exists
    if (fs.existsSync('credentials.txt')) {
        const credentials = fs.readFileSync('credentials.txt', 'utf8').split('\n');
        userEmail = credentials[0].trim();
        password = credentials[1].trim();

        const useCredentialsText = await new Promise(resolve => {
            rl.question(chalk.yellow('Sign in as ' + userEmail + '? y/n: '), resolve);
        });

        console.clear();

        if (useCredentialsText == 'n') {
            useCredentials = false;
        } else {
            useCredentials = true;
        }

    } else {
        console.log(chalk.red('No saved user credentials found.'));
    }

    // EMAIL //

    let emailValid = false;
    let title = '';
    let titleElement = '';

    while (emailValid == false) {
        await page.waitForXPath(titleXPath);
        titleElement = await page.$x(titleXPath);
        title = await page.evaluate(element => element.textContent, titleElement[0]);


        // get email if not using saved credentials
        if (useCredentials == true) {
            console.log(chalk.bold('Auto Login Active'));
            console.log("");
            console.log(chalk.blue("Current page title: ") + title);
        } else {
            console.log(chalk.blue("Current page title: ") + title);
            const username = await new Promise(resolve => {
                rl.question(chalk.yellow('Enter your username [the part before the @]: '), resolve);
            });
            userEmail = username.toLowerCase() + "@live.rhul.ac.uk";
        }

        console.log(`Logging in as ${userEmail}`)

        // type email
        await page.waitForXPath(emailInputXPath);
        const emailInput = await page.$x(emailInputXPath);
        await emailInput[0].type(userEmail);

        console.log('Entering email...');

        // click next
        await page.waitForXPath(nextButtonXPath);
        const nextButton = await page.$x(nextButtonXPath);
        await nextButton[0].click();

        console.log('Clicking next...');

        // Wait for the next page to load
        await setTimeout(1000);
        console.clear();

        // Check if the title says 'Enter password' using the xpath
        await page.waitForXPath(titleXPath);
        titleElement = await page.$x(titleXPath);
        title = await page.evaluate(element => element.textContent, titleElement[0]);

        if (title == 'Enter password') {
            emailValid = true;
        } else {
            console.log(chalk.red('Invalid Username. Please try again.'));
            await page.reload();
        }
    };

    // PASSWORD //

    // get password

    let passwordValid = false;
    while (passwordValid == false) {
        // get password if not using saved credentials
        if (useCredentials == true) {
            console.log(chalk.bold('Auto Login Active'));
            console.log("");
            console.log(chalk.blue("Current page title: ") + title);
        } else {
            console.log(chalk.blue("Current page title: ") + title);
            password = await new Promise(resolve => {
                rl.question(chalk.yellow('Enter your password: '), resolve);
            });
        }

        // typing password
        await page.waitForXPath(passwordInputXPath);
        const passwordInput = await page.$x(passwordInputXPath);
        await passwordInput[0].type(password);

        console.log('Entering password...');

        // click sign in
        await page.waitForXPath(signInButtonXPath);
        const signInButton = await page.$x(signInButtonXPath);
        await signInButton[0].click();

        console.log('Clicking sign in...');

        // Check if the title says 'Enter password' using the xpath
        try {
            await page.waitForXPath(titleXPath, { timeout: 2000 });
            console.clear();
            titleElement = await page.$x(titleXPath);
            
            await setTimeout(1000);
    
            if (titleElement.length > 0) {
                title = await page.evaluate(element => element.textContent, titleElement[0]);
    
                if (title != 'Enter password') {
                    passwordValid = true;
                } else {
                    console.log(chalk.red('Invalid password. Please try again.'));
                }
            } else {
                console.log(chalk.green("Password accepted!"));
            }
        } catch (error) {
            passwordValid = true;
            // console.log('XPath not found within the specified timeout. Assuming user was signed in. Continuing execution...');
        }
    };

    console.clear();

    // 2FA //

    try {
        let twoFASuccesful = false;
        while (twoFASuccesful == false)
        {
            // Check if the URL is still Microsoft
            if (page.url().includes('microsoftonline')) {

                // Grab the verification code using XPath
                console.log('Waiting for verification code...');

                await page.waitForXPath(verificationCodeXPath);
                const verificationCodeElement = await page.$x(verificationCodeXPath);
                const verificationCode = await page.evaluate(element => element.textContent, verificationCodeElement[0]);

                console.clear();

                async function countdown(verificationCode){
                    let time = 60;
                    let breakout = false;
                    let text = '';
                    while (time > 0 && breakout == false) {
                        console.log(chalk.yellow(`Please verify your login with the code: ${chalk.blue(verificationCode)}. Use your mobile app to verify.`));
                        console.log("");
                        console.log(chalk.bold(time + ' seconds remaining...'));
                        
                        time--;

                        try {
                            await page.waitForXPath('//*[@id="lightbox"]/div[3]/div/div[2]/div/div[1]/text()', { visible: true, timeout: 500 });
                            const textElement = await page.$x('//*[@id="lightbox"]/div[3]/div/div[2]/div/div[1]/text()');
                            text = await page.evaluate(element => element.textContent, textElement[0]);
                        } catch (error) {
                            // this error is fine who cares
                        }

                        // wrong title 
                        try {
                            await page.waitForXPath('//*[@id="idDiv_SAASDS_Title"]', { visible: true, timeout: 500 });
                            titleElement = await page.$x('//*[@id="idDiv_SAASDS_Title"]');
                            text = await page.evaluate(element => element.textContent, titleElement[0]);
                        } catch {
                            // this error is fine who cares fr
                        }
                        
                        console.clear();

                        if (text != "") {
                            breakout = true;
                        }
                    }
                }

                page.waitForNavigation({ visible: true, timeout: 62000 });

                await countdown(verificationCode);
            }

            let timeoutTitle = '';
            let wrongTitle = '';

            // timeout title
            try {
                await page.waitForXPath('//*[@id="idDiv_SAASTO_Title"]', { visible: true, timeout: 500 });
                titleElement = await page.$x('//*[@id="idDiv_SAASTO_Title"]');
                title = await page.evaluate(element => element.textContent, titleElement[0]);
                timeoutTitle = title;
            } catch {
                timeoutTitle = '';
            }

            // wrong title 
            try {
                await page.waitForXPath('//*[@id="idDiv_SAASDS_Title"]', { visible: true, timeout: 500 });
                titleElement = await page.$x('//*[@id="idDiv_SAASDS_Title"]');
                title = await page.evaluate(element => element.textContent, titleElement[0]);
                wrongTitle = title;
            } catch {
                wrongTitle = '';
            }

            if ((timeoutTitle != "We didn't hear from you" && wrongTitle != "Request denied")) {
                twoFASuccesful = true;
                console.log(chalk.green("2FA Authentication Complete!"));
            } else {
                console.log(chalk.red("2FA failed! Please try again."));
                await setTimeout(1000);
                console.clear();
                await page.goto(RHULattendanceURL);
                await setTimeout(1000);
            }
        }
    } catch (error) {
        console.log(chalk.red("2FA failed! Please try again."));
        await setTimeout(1000);
        console.clear();
        await page.goto(RHULattendanceURL);
        await setTimeout(1000);
    }

    console.clear();

    // SAVE CREDENTIALS //

    // Ask if the user wants to save their credentials, if they haven't already
    if (useCredentials == false) {
        const saveDetails = await new Promise(resolve => {
            rl.question(chalk.yellow('Save login details for next time? y/n '), resolve);
        });

        console.clear();

        if (saveDetails == 'n') {
            console.log('Proceeding without saving details');
        } else {
            console.log('Saving login details...');

            // Write email and password to a file
            const credentials = `${userEmail}\n${password}`;

            fs.writeFile('credentials.txt', credentials, (err) => {
                if (err) {
                    console.error(chalk.red('Error writing credentials to file:'), err);
                } else {
                    console.log(chalk.green('Credentials saved to file.'));
                }
            });
        }
    }

    console.clear();

    if (page.url().includes('generalssb-prod.ec.royalholloway.ac.uk')) {
        console.log(chalk.green('Login successful!'));

    } else if (page.url().includes('microsoftonline')) {
        console.log("Enabling 'Stay Signed In...'");

        await page.waitForXPath(staySignedInButtonXPath, { visible: true });
        const staySignedInButton = await page.$x(staySignedInButtonXPath);
        await staySignedInButton[0].click();
    };

    console.log(chalk.green('Sign In Complete!'));
    await setTimeout(1000);
    console.clear();

    // REGISTER ATTENDANCE //

    let signedIn = true;
    let time = '';
    let timeElement = '';
    let check = false;
    let lecture1 = false;
    let lecture2 = false;
    let lecturesFound = 0;
    let programTitle = 'Auto Attendance v' + v + ' by '+lukeLink+' and '+connorLink+' on GitHub ';

    await page.waitForXPath(userFullNameXPath);
    let fullName = await page.$x(userFullNameXPath);
    fullName = await page.evaluate(element => element.textContent, fullName[0]);

    let firstRun = true;
    while (signedIn == true) {

        // check time //
        await page.waitForXPath(clockXPath);
        timeElement = await page.$x(clockXPath);
        time = await page.evaluate(element => element.textContent, timeElement[0]);

        console.log(chalk.bold(programTitle));
        console.log("");
        console.log(chalk.blue("Signed in as: ") + fullName + " [" + userEmail + "]");
        console.log(chalk.blue("Total lectures this session: ") + totalLectures);
        console.log(chalk.blue("Current time: ") + time);
        console.log("");

        const hours = parseInt(time.substring(11, 13));
        const minutes = parseInt(time.substring(14, 16));
        const seconds = parseInt(time.substring(17, 19));
        //console.log("Current hours: " + hours);
        //console.log("Current minutes: " + minutes);
        //console.log("Current seconds: " + seconds);

        if (((minutes + 1) % 15 == 0) && (seconds == 0 || seconds == 1)) {
            console.log("Refreshing...");
            await page.reload();
            await setTimeout(1000);
        }

        if (minutes == target || firstRun) {
            check = true;
            lecturesFound = 0;

            if (firstRun) {
                console.log("Checking for unregistered attendance...");
            } else {
                console.log("It's " + hours + ":" + target + "! Checking for unregistered attendance...");
            }
            firstRun = false;
            await page.reload();
            console.log("Refreshing...")

            // LECTURE 1
            try {
                await page.waitForXPath(registerAttendanceButton1XPath, { visible: true, timeout: 2000 });
                const registerAttendanceButton1 = await page.$x(registerAttendanceButton1XPath);
                await registerAttendanceButton1[0].click();
                lecture1 = true;
                lecturesFound++;
            } catch (error) {
                lecture1 = false;
            };

            // LECTURE 2
            try {
                await page.waitForXPath(registerAttendanceButton2XPath, { visible: true, timeout: 2000 });
                const registerAttendanceButton2 = await page.$x(registerAttendanceButton2XPath);
                await registerAttendanceButton2[0].click();
                lecture2 = true;
                lecturesFound++;
            } catch (error) {
                lecture2 = false;
            };

            totalLectures += lecturesFound;
        };

        if (check == true) {
            let lectureColor = chalk.red;
            if (lecturesFound > 0) {
                lectureColor = chalk.green;
            }
            console.log(lectureColor(lecturesFound + " lecture(s) found."));
        }

        if (lecture1 == false && lecture2 == false && check == true) {
            console.log(chalk.green("No pending registrations."));
            await setTimeout(60000); // wait for 1 minute to prevent multiple registrations
        } else if ((lecture1 == true || lecture2 == true) && check == true) {
            console.log(chalk.green("All pending registrations complete."));
            await setTimeout(60000); // wait for 1 minute to prevent multiple registrations
        } else {
            if (minutes < parseInt(target)) {
                console.log("Waiting for " + hours + ":" + target + "...");
            } else {
                console.log("Waiting for " + ((hours + 1) == 24 ? '0' : (hours + 1)) + ":" + target + "...");
            }
        }

        check = false;
        lecture1 = false;
        lecture2 = false;

        // stops clock from spamming the console
        await setTimeout(1000);
        console.clear();
    }

    rl.close();
    await p.close();
}

main();
