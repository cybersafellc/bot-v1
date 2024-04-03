import axios from "axios";
import chalk from "chalk";
import fs from "fs";
let data = [];

const proxyGrabber = async () => {
  await console.log(chalk.green("STARTED..."));
  for (let i = 1; i <= 9; i++) {
    await getProxyJson(i);
  }
  await console.log(chalk.green("WAIT FOR SAVING TO : proxy-grabber.txt...."));
  for (let i = 0; i < 9; i++) {
    for (const dataS of data[i]) {
      writeDataToFile("proxy-grabber.txt", `${dataS.ip}:${dataS.port}`);
    }
  }
  await console.log(chalk.green("COMPLETED PROCESS"));
  return;
};

const getProxyJson = async (page) => {
  await axios
    .get(
      `https://proxylist.geonode.com/api/proxy-list?protocols=socks4%2Csocks5&speed=fast&limit=500&page=${page}&sort_by=lastChecked&sort_type=desc`
    )
    .then((ress) => {
      data.push(ress.data.data);
      console.log(chalk.blue(`SUCCESS GRAB : ${page} - 9`));
    })
    .catch((err) => {
      console.log(
        chalk.red("NETWROK ERROR: Please chek your internet connection!")
      );
    });
  return;
};

function writeDataToFile(filename, data) {
  fs.appendFileSync(filename, data + "\n", "utf8");
}

export default proxyGrabber;
