import fs from "fs";
import puppeteer from "puppeteer";
import chalk from "chalk";

const proxyCheker = async () => {
  await fs.readFile("./proxy.txt", "utf-8", (err, data) => {
    if (err) {
      console.error(chalk.red("UH-OH ERROR READ THE FILE! 'proxy.txt'"));
      return;
    }
    const proxyList = data
      .trim()
      .split("\n")
      .map((line) => line.trim());
    return running(proxyList);
  });
};

const running = async (proxyList) => {
  for (let i = 0; i < proxyList.length; i++) {
    const status = await lunch(proxyList[i]);
    if (status) {
      console.log(
        chalk.blue(Date()) +
          " => " +
          chalk.green("ACTIVE PROXY : " + proxyList[i])
      );
      writeDataToFile("active-proxy.txt", proxyList[i]);
    } else {
      console.log(
        chalk.blue(Date()) + " => " + chalk.red("DIE PROXY : " + proxyList[i])
      );
      writeDataToFile("die-proxy.txt", proxyList[i]);
    }
  }
  await console.log(chalk.green("COMPLETED..."));
  return;
};

const lunch = async (proxy) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [`--proxy-server=${proxy}`],
  });
  try {
    const page = await browser.newPage();
    await page.goto("https://ip-api.com/json/8.8.8.8", {
      timeout: 6000,
    });
    await browser.close();
    return true;
  } catch (error) {
    await browser.close();
    return false;
  }
};

function writeDataToFile(filename, data) {
  fs.appendFileSync(filename, data + "\n", "utf8");
}

export default proxyCheker;
