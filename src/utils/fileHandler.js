import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages = []
  for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    pages.push(content.items.map((item) => item.str).join(' '))
  }
  return pages.join('\n')
}

export async function processFile(file) {
  const isImage = file.type.startsWith('image/')
  const isPdf = file.type === 'application/pdf'

  if (isImage) {
    const dataUrl = await readImageAsDataUrl(file)
    return { type: 'image', name: file.name, preview: dataUrl, content: dataUrl }
  }

  if (isPdf) {
    const text = await extractPdfText(file)
    return { type: 'pdf', name: file.name, preview: null, content: text }
  }

  throw new Error('不支持的文件类型')
}
