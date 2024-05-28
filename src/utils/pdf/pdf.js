import path from 'path'
import fs from 'fs'
import puppeteer from 'puppeteer'
import nodemailer from 'nodemailer'
import { env } from '../../options/env.js'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pdfDirectory = path.join(__dirname, 'pdfs')
if (!fs.existsSync(pdfDirectory)) {
  fs.mkdirSync(pdfDirectory, { recursive: true })
}

export const generatePdfPath = () => {
  const filename = `${uuidv4()}.pdf`
  const filepath = path.join(pdfDirectory, filename)
  return { filepath, filename }
}

export async function buildPdf(filepath, infoPackage) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const htmlFilePath = path.join(__dirname, 'html/views', 'template.html')
  let htmlContent = fs.readFileSync(htmlFilePath, 'utf8')
  await page.addStyleTag({
    url: 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'
  })

  htmlContent = htmlContent.replace(
    '{{id_buy_package}}',
    infoPackage[0].id_buy_package
  )
  htmlContent = htmlContent.replace('{{name_user}}', infoPackage[0].name_user)
  htmlContent = htmlContent.replace(
    '{{lastname_user}}',
    infoPackage[0].lastname_user || ''
  )
  htmlContent = htmlContent.replace('{{email}}', infoPackage[0].email)
  htmlContent = htmlContent.replace('{{phone}}', infoPackage[0].phone || '')
  htmlContent = htmlContent.replace('{{address}}', infoPackage[0].address || '')
  htmlContent = htmlContent.replace(
    '{{name_country}}',
    infoPackage[0].name_country
  )
  htmlContent = htmlContent.replace(
    '{{name_hotels}}',
    infoPackage[0].name_hotels
  )
  htmlContent = htmlContent.replace(
    '{{name_restaurant}}',
    infoPackage[0].name_restaurant
  )
  htmlContent = htmlContent.replace(
    '{{attraction1}}',
    infoPackage[0].attraction1
  )
  htmlContent = htmlContent.replace(
    '{{attraction2}}',
    infoPackage[0].attraction2
  )
  htmlContent = htmlContent.replace(
    '{{price_package}}',
    infoPackage[0].price_package
  )

  await page.setContent(htmlContent)

  await page.pdf({
    path: filepath,
    format: 'A4',
    printBackground: true
  })

  await browser.close()
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: env.MAILUSER,
    pass: env.MAILPASS
  }
})

export const sendEmailWithPdf = (email, filepath, name, callback) => {
  const mailOptions = {
    from: 'tu_correo@gmail.com',
    to: email,
    subject: 'Confirmación de compra del paquete',
    text: 'Adjunto encontrarás la confirmación de tu compra.',
    attachments: [
      {
        filename: name,
        path: filepath
      }
    ]
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('[sendEmailWithPdf] Error al enviar correo:', error)
      callback(error)
    } else {
      console.log('[sendEmailWithPdf] Correo enviado:', info.response)
      callback(null, info)
    }
  })
}
