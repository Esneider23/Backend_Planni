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
  await waitFor(3000) // Asegúrate de que `waitFor` está definida o usa page.waitForTimeout(3000).

  const html = await page.content()
  await browser.close()

  const $ = cheerio.load(html)
  let firstHotelFound = null // Usaremos null para manejar el caso en el que no se encuentren hoteles.

  $('.uaTTDe').each((i, el) => {
    if (firstHotelFound) return false // Si ya encontramos un hotel, salimos del bucle.

    const titleElement = $(el).find('.QT7m7 > h2')
    const priceElement = $(el).find('.kixHKb span').first()
    const priceText = priceElement.text().trim()

    // Asegúrate de que la expresión regular coincida con el formato de precio esperado
    if (/^\$\s*\d{1,3}(\.\d{3})*$/.test(priceText)){
      firstHotelFound = sanitize({
        title: titleElement.text(),
        price: priceText.replace(/\D/g, '') // Elimina todos los caracteres no numéricos para obtener solo el número.
      })
    }
  })

  if (!firstHotelFound) {
    return null // Devuelve null si no se encontró ningún hotel
  } else {
    return firstHotelFound // Devuelve el primer hotel encontrado
  }
}

/* export const scrapeWebsiteViator = async (look) => {
  const VIATOR_URL = `https://www.getyourguide.es/s/?q=${look}&searchSource=3`
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.setJavaScriptEnabled(true);
  await page.goto(VIATOR_URL)

  await page.waitForSelector('.vertical-activity-card__title');
  

  const title = await page.evaluate(() => {
    const titleElement = document.querySelector('.vertical-activity-card__title');
    return titleElement ? titleElement.textContent.trim() : null;
  });

  await browser.close();
  return title;
}

