import puppeteer from 'puppeteer'
import cheerio from 'cheerio'
import { sanitize } from './sanitize.js'

// eslint-disable-next-line promise/param-names
const waitFor = (timeInMs) => new Promise((r) => setTimeout(r, timeInMs))

export const scrapeWebsiteGoogleHotels = async (look) => {
  const GOOGLE_HOTEL_PRICE = `https://www.google.com/travel/hotels?q=${encodeURIComponent(look)}&utm_campaign=sharing&utm_medium=link&utm_source=htls&ved=0CAAQ5JsGahcKEwiwocKUmrGFAxUAAAAAHQAAAAAQBQ&ts=CAEaIAoCGgASGhIUCgcI6A8QBRgZEgcI6A8QBRgeGAUyAggCKgkKBToDQ09QGgA&rp=OAE`
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.goto(GOOGLE_HOTEL_PRICE)

  const buttonConsentReject = await page.$(
    '.VfPpkd-LgbsSe[aria-label="Reject all"]'
  )
  if (buttonConsentReject) await buttonConsentReject.click()
  await waitFor(3000)

  const html = await page.content()
  await browser.close()

  const $ = cheerio.load(html)
  let firstHotelFound = null

  $('.uaTTDe').each((i, el) => {
    if (firstHotelFound) return false

    const titleElement = $(el).find('.QT7m7 > h2')
    const priceElement = $(el).find('.kixHKb span').first()
    const priceText = priceElement.text().trim()

    if (/^\$\s*\d{1,3}(\.\d{3})*$/.test(priceText)) {
      firstHotelFound = sanitize({
        title: titleElement.text(),
        price: priceText.replace(/\D/g, '')
      })
    }
  })

  if (!firstHotelFound) {
    return null // Devuelve null si no se encontró ningún hotel
  } else {
    return firstHotelFound // Devuelve el primer hotel encontrado
  }
}

export const scrapeWebsiteGetYourGuide = async (look) => {
  const VIATOR_URL = `https://www.getyourguide.es/s/?q=${look}&searchSource=3`
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
  )
  await page.setViewport({ width: 1280, height: 800 })

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false
    })
  })

  await page.goto(VIATOR_URL, { waitUntil: 'networkidle0' })

  await page.waitForSelector('.vertical-activity-card', { timeout: 10000 })

  const data = await page.evaluate((look) => {
    const results = {}
    const cards = document.querySelectorAll('.vertical-activity-card')
    let count = 0
    cards.forEach((card) => {
      if (count < 2) {
        const titleElement = card.querySelector(
          '.vertical-activity-card__title'
        )
        const priceElement = card.querySelector(
          '.baseline-pricing__from--value'
        )
        const title = titleElement ? titleElement.innerText.trim() : null
        let price = priceElement ? priceElement.innerText.trim() : null
        price = price.replace(/COL\$/, '').trim()

        // Verificar si el título contiene al menos una de las palabras de búsqueda
        const containsWord = look
          .split(' ')
          .some((word) => title.toLowerCase().includes(word.toLowerCase()))
        if (containsWord) {
          results['result_' + (count + 1)] = { title, price }
          count++
        }
      }
    })
    return results
  }, look)

  // Sanitizar los datos antes de devolverlos
  const sanitizedData = Object.keys(data).reduce((acc, key) => {
    acc[key] = sanitize(data[key])
    return acc
  }, {})

  await browser.close()

  return sanitizedData
}

/* (async () => {
  const look = 'snorkel cartagena'
  console.log('Google Hotels:')
  const tour = await scrapeWebsiteGoogleHotels(look)
  console.log(tour)
  console.log('Viator:')
  const tour2 = await scrapeWebsiteViator(look)
  console.log(tour2)
})()
 */