import { createWorker, PSM } from 'tesseract.js'
import { preprocessImage } from './imagePreprocessed'

export async function recognizeReceipt(image: File, onProgress?: (progress: number) => void) {
  const processed = await preprocessImage(image)

  const worker = await createWorker('eng', undefined, {
    logger(message) {
      if (message.status === 'recognizing text' && message.progress) {
        onProgress?.(Math.round(message.progress * 100))
      }
    },
  })

  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
    preserve_interword_spaces: '1',
    textord_space_size_is_variable: '1',
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:-',
  })

  const result = await worker.recognize(processed)

  await worker.terminate()

  return result.data.text
}
