import puppeteer from "puppeteer";
import fs from "fs";
import chalk from "chalk";

const affyntuyul = async (totalBrowser) => {
  await console.log(chalk.green("STARTED..."));
  await fs.readFile("./active-proxy.txt", "utf-8", (err, data) => {
    if (err) {
      console.error(chalk.red("UH-OH ERROR READ THE FILE! 'active-proxy.txt'"));
      return;
    }
    const proxyList = data
      .trim()
      .split("\n")
      .map((line) => line.trim());
    return runnings(proxyList[0], totalBrowser);
  });
};

const runnings = async (proxy, totalBrowser) => {
  for (let i = 0; i < totalBrowser; i++) {
    await running(proxy);
    console.log(chalk.green(`DONE BROWSER ${totalBrowser + 1} OPENED`));
  }
};

const running = async (proxy) => {
  const browser = await puppeteer.launch({
    headless: false,
    // args: [`--proxy-server=${proxy}`],
    timeout: 60000,
  });

  try {
    const pageYopmail = await browser.newPage();
    await pageYopmail.goto("https://yopmail.com/", { timeout: 60000 });

    const pageTwitter = await browser.newPage();
    await pageTwitter.goto("https://x.com/", { timeout: 60000 });
    await pageTwitter.$('a[href="/i/flow/signup"]');
    await pageTwitter.click('a[href="/i/flow/signup"]');

    const pageAffyn = await browser.newPage();
    await pageAffyn.goto("https://farming.affyn.com/quest", { timeout: 60000 });

    return;
  } catch (error) {
    await browser.close();
    console.log(chalk.red("PROXY ERROR => " + error));
    return;
  }
};

export default affyntuyul;
