import fs from 'fs';
const logger = fs.createWriteStream("./helpers/app.log", { flags: "a" }); // 'a' means append

export default function log(message) {
  logger.write(
    `${new Date().toISOString()} - ${message}\n`,
  );
}