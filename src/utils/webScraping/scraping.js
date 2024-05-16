import puppeteer from 'puppeteer'
import cheerio from 'cheerio'
import { sanitize } from './sanitize.js'

// eslint-disable-next-line promise/param-names
const waitFor = (timeInMs) => new Promise((r) => setTimeout(r, timeInMs))

export const scrapeWebsiteGoogleHotels = async (look) => {
  const GOOGLE_HOTEL = `https://www.google.com/travel/hotels?q=${encodeURIComponent(look)}&utm_campaign=sharing&utm_medium=link&utm_source=htls&ved=0CAAQ5JsGahcKEwiwocKUmrGFAxUAAAAAHQAAAAAQBQ&ts=CAEaIAoCGgASGhIUCgcI6A8QBRgZEgcI6A8QBRgeGAUyAggCKgkKBToDQ09QGgA&rp=OAE`
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto(GOOGLE_HOTEL)

  const buttonConsentReject = await page.$('.VfPpkd-LgbsSe[aria-label="Reject all"]')
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
    const priceText = priceElement.text().trim() // Extraer texto del precio

    const pricePattern = /^(\$|COP)\s*\d{1,3}(?:[.,]\d{3})*(?:,\d{2})?$/ // /^COP|\$ (\d+)((\.|,)\d+)*$/

    if (pricePattern.test(priceText)) {
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
  const GetYourGuideUrl = `https://www.getyourguide.es/s/?q=${look}&searchSource=3`
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

  await page.goto(GetYourGuideUrl, { waitUntil: 'networkidle0' })
  await page.waitForSelector('.vertical-activity-card', { timeout: 10000 })

  const data = await page.evaluate((look) => {
    const cards = document.querySelectorAll('.vertical-activity-card')
    for (const card of cards) {
      const titleElement = card.querySelector('.vertical-activity-card__title')
      const priceElement = card.querySelector('.baseline-pricing__from--value')
      if (titleElement && priceElement) {
        const title = titleElement.innerText.trim()
        const price = priceElement.innerText.trim().replace(/COL\$/, '').trim()

        // Verificar si el título contiene al menos una de las palabras de búsqueda
        const containsWord = look
          .split(' ')
          .some((word) => title.toLowerCase().includes(word.toLowerCase()))

        if (containsWord) {
          return { title, price } // Devolver el primer resultado que cumple la condición
        }
      }
    }
    return null // Devolver null si no se encuentra ningún resultado que cumpla la condición
  }, look)

  await browser.close()

  // Asegurar que se sanitiza el resultado antes de devolverlo
  const sanitizedData = data ? sanitize(data) : {}
  return sanitizedData
}

/* (async () => {
  const look = 'snorkel cartagena'
  console.log('Google Hotels:')
  console.log('Viator:')
  const tour2 = await scrapeWebsiteGetYourGuide(look)
  console.log(tour2)
})() */
