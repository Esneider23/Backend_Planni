import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pdf from 'html-pdf'

// Definir __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pdfDirectory = path.join(__dirname, 'pdfs');
if (!fs.existsSync(pdfDirectory)) {
    fs.mkdirSync(pdfDirectory, { recursive: true });
}

// Función para generar la ruta del PDF
export const generatePdfPath = () => {
  const filename = `${uuidv4()}.pdf`
  const filepath = path.join(__dirname, 'pdfs', filename)
  return { filepath, filename }
}

export function buildPdf(filepath, callback) {
    const htmlFilePath = path.join(__dirname, 'html/views', 'template.html');
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

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


export const downloadPdf = (req, res) => {
    const { filename } = req.params;
    const filepath = path.join(__dirname, 'pdfs', filename);
    res.download(filepath, err => {
        if (err) {
            console.error('[controller] Error al descargar PDF:', err.message);
            res.status(500).send('Error al descargar el archivo.');
        }
    });
};
