import puppeteer from 'puppeteer'
import fs from 'fs/promises'
import path from 'path'
import papa from 'papaparse'
import { delay } from './utils'

const NUM_PAGES = 600
const LOAD_MORE_CONTAINER = '.load-more-container button'
const CARD_SELECTOR = 'app-partner-card'
const TITLE_SELECTOR = 'h2'
const DESCRIPTION_SELECTOR = 'p'
const CONTENT_CONTAINER_SELECTOR = '.detail-list-container'
const LOGO_SELECTOR = 'img'

export async function parse() {
  const browser = await puppeteer.launch({
    // headless: false,
    defaultViewport: {
      width: 1440,
      height: 1080,
    },
  })
  const page = await browser.newPage()
  await page.goto('https://cloud.google.com/find-a-partner/')

  for (let i = 0; i < NUM_PAGES; i += 1) {
    const button = await page.waitForSelector(LOAD_MORE_CONTAINER)
    button?.click()
    console.log(`⏲️ Fetched page ${i + 1} of ${NUM_PAGES}...`)
    await delay(2000)
  }

  const partners = await page.evaluate(
    (cardSelector, titleSelector, logoSelector, descriptionSelector, contentContainerSelector) => {
      const result = []
      const cards = Array.from(document.querySelectorAll(cardSelector))
      for (const card of cards) {
        const title = card.querySelector(titleSelector)?.textContent ?? ''
        const logo = card.querySelector(logoSelector)?.getAttribute('src') ?? ''
        const description = card.querySelector(descriptionSelector)?.textContent ?? ''
        let specializations = ''
        let expertise = ''
        let initiatives = ''
        let products = ''
        let location = ''

        const contents = Array.from(card.querySelectorAll(contentContainerSelector))
        for (const content of contents) {
          const contentTitle = content?.querySelector('h3')?.textContent
          if (contentTitle === 'Specializations') {
            specializations = content?.querySelector('.gmat-body-2')?.textContent ?? ''
          } else if (contentTitle === 'Expertises') {
            expertise = content?.querySelector('.gmat-body-2')?.textContent ?? ''
          } else if (contentTitle === 'Initiatives') {
            initiatives = content?.querySelector('.gmat-body-2')?.textContent ?? ''
          } else if (contentTitle === 'Products') {
            products = content?.querySelector('.gmat-body-2')?.textContent ?? ''
          } else {
            const isLocation = !!content?.querySelector('.location-list-icon')
            if (isLocation) {
              location = content?.querySelector('.detail-list-content')?.textContent ?? ''
            }
          }
        }

        result.push({
          title: title.trim(),
          logo: logo.trim(),
          description: description.trim(),
          specializations: specializations.trim(),
          expertise: expertise.trim(),
          initiatives: initiatives.trim(),
          products: products.trim(),
          location: location.trim(),
        })
      }
      return result
    },
    CARD_SELECTOR,
    TITLE_SELECTOR,
    LOGO_SELECTOR,
    DESCRIPTION_SELECTOR,
    CONTENT_CONTAINER_SELECTOR,
  )
  await browser.close()
  const csv = papa.unparse(partners)
  await fs.writeFile(path.resolve(__dirname, 'partners-google-cloud.csv'), csv, 'utf-8')
}
