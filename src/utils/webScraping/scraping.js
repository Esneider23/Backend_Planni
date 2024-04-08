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

  let cheapestHotel = null // Almacenará el hotel más económico entre los tres primeros

  $('.uaTTDe').each((i, el) => {
    if (i >= 3 || cheapestHotel) return // Salir del bucle si ya hemos evaluado los primeros tres hoteles o ya hemos encontrado el más económico

    const titleElement = $(el).find('.QT7m7 > h2')
    const priceElement = $(el).find('.kixHKb span').first()
    const priceText = priceElement.text().trim()

    if (/COP\s*\d/.test(priceText)) {
      const numericPrice = parseInt(priceText.replace(/\D/g, ''), 10) // Convertir el precio a un número eliminando cualquier carácter no numérico
      if (!cheapestHotel || numericPrice < cheapestHotel.price) {
        cheapestHotel = sanitize({
          title: titleElement.text(),
          price: numericPrice
        })
      }
    }
  })
  return cheapestHotel  // Devolver el hotel más económico
}

export const scrapeWebsiteViator = async (look) => {
  const VIATOR_URL = `https://www.viator.com/es-CO/searchResults/all?text=${encodeURIComponent(look)}`
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto(VIATOR_URL)
}
