import puppeteer from "puppeteer";
import fs from "fs";
import chalk, { Chalk } from "chalk";

const promFaucet = async () => {
  await fs.readFile("./active-proxy.txt", "utf-8", (err, data) => {
    if (err) {
      console.error(chalk.red("UH-OH ERROR READ THE FILE! 'active-proxy.txt'"));
      return;
    }
    const proxyList = data
      .trim()
      .split("\n")
      .map((line) => line.trim());
    return running(proxyList);
  });
};

const running = async (proxys) => {
  console.log(chalk.green("=> STARTED..."));
  for (let i = 0; i < proxys.length; i++) {
    await launch(proxys[i]);
  }
  console.log(chalk.green("=> COMPLETED PROCESS!"));
};

const launch = async (proxy) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [`--proxy-server=${proxy}`],
  });
  try {
    const page = await browser.newPage();
    await page.goto("https://faucet.prom.io/");
    await page.$('input[placeholder="Enter your wallet address"]');
    await page.$("div.framer-8o80si");
    await page.type(
      'input[placeholder="Enter your wallet address"]',
      await process.env.PROM_ADDRESS
    );
    await new Promise((resolve) => setTimeout(resolve, 4000));
    await page.click("div.framer-8o80si");
    await new Promise((resolve) => setTimeout(resolve, 31000)); // membuat waktu tunggu yang diterima di asyn bukan kek settimout kebal async
    await console.log(
      chalk.blue(Date()) +
        " => " +
        chalk.green("0.25 PROM ADDED TO " + process.env.PROM_ADDRESS)
    );
    await browser.close();
    return;
  } catch (error) {
    await console.log(chalk.red("PROXY ERROR") + " => " + error);
    await browser.close();
    return;
  }
};

export default promFaucet;
