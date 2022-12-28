const { join } = require('path')

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
}
