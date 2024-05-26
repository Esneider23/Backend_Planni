import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdf from 'html-pdf';

// Definir __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfDirectory = path.join(__dirname, 'pdfs');
if (!fs.existsSync(pdfDirectory)) {
    fs.mkdirSync(pdfDirectory, { recursive: true });
}

// Función para generar la ruta del PDF
export const generatePdfPath = () => {
  const filename = `${uuidv4()}.pdf`;
  const filepath = path.join(__dirname, 'pdfs', filename);
  return { filepath, filename };
}

export function buildPdf(filepath, infoPackage, callback) {
    const htmlFilePath = path.join(__dirname, 'html/views', 'template.html');
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

    // Replace placeholders with actual data
    htmlContent = htmlContent.replace('{{id_buy_package}}', infoPackage[0].id_buy_package);
    htmlContent = htmlContent.replace('{{name_user}}', infoPackage[0].name_user);
    htmlContent = htmlContent.replace('{{lastname_user}}', infoPackage[0].lastname_user || '');
    htmlContent = htmlContent.replace('{{email}}', infoPackage[0].email);
    htmlContent = htmlContent.replace('{{phone}}', infoPackage[0].phone || '');
    htmlContent = htmlContent.replace('{{address}}', infoPackage[0].address || '');
    htmlContent = htmlContent.replace('{{name_country}}', infoPackage[0].name_country);
    htmlContent = htmlContent.replace('{{name_hotels}}', infoPackage[0].name_hotels);
    htmlContent = htmlContent.replace('{{name_restaurant}}', infoPackage[0].name_restaurant);
    htmlContent = htmlContent.replace('{{attraction1}}', infoPackage[0].attraction1);
    htmlContent = htmlContent.replace('{{attraction2}}', infoPackage[0].attraction2);
    htmlContent = htmlContent.replace('{{price_package}}', infoPackage[0].price_package);

    pdf.create(htmlContent).toFile(filepath, (err, _) => {
        if (err) {
            console.error('[buildPdfFromHtml] Error al generar PDF:', err);
            callback(err);
        } else {
            console.log('[buildPdfFromHtml] PDF generado exitosamente.');
            callback(null);
        }
    });
}