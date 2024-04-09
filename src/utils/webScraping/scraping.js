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

  const hotelsList = []
  const $ = cheerio.load(html)

  $('.uaTTDe').each((i, el) => {
    const titleElement = $(el).find('.QT7m7 > h2')
    const priceElement = $(el).find('.kixHKb span').first()

    const hotelInfo = sanitize({
      title: titleElement.text(),
      price: priceElement.text()
    })

    hotelsList.push(hotelInfo)
  })

  if (hotelsList.length > 0) {
    return hotelsList[0]
  } else {
    console.log('{}')
  } // Devolver el hotel más económico
}

export const scrapeWebsiteViator = async (look) => {
  const VIATOR_URL = `https://www.viator.com/es-CO/searchResults/all?text=${encodeURIComponent(look)}`
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto(VIATOR_URL)
}