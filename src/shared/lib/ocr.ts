import { createWorker, PSM } from 'tesseract.js'

export async function recognizeReceipt(image: File, onProgress?: (progress: number) => void) {
  let worker
  if (typeof Worker !== 'undefined') {
    worker = await createWorker('ind', undefined, {
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
  }

  if (worker) {
    const result = await worker.recognize(image)

    // await worker.terminate()

    return result.data.text
  } else {
    return ''
  }
}
