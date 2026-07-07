import { createWorker } from 'tesseract.js'

export async function recognizeReceipt(image: File, onProgress?: (progress: number) => void) {
  const worker = await createWorker('eng', undefined, {
    logger(message) {
      if (message.status === 'recognizing text' && message.progress) {
        onProgress?.(Math.round(message.progress * 100))
      }
    },
  })

  const result = await worker.recognize(image)

  await worker.terminate()

  return result.data.text
}
