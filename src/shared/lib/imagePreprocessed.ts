declare const cv: any

function waitForOpenCV(): Promise<void> {
  return new Promise((resolve) => {
    const check = () => {
      if (cv && cv.Mat) {
        resolve()
      } else {
        setTimeout(check, 100)
      }
    }

    check()
  })
}

export async function preprocessImage(file: File): Promise<Blob> {
  await waitForOpenCV()

  return new Promise((resolve) => {
    const img = new Image()

    img.onload = () => {
      const scale = 3

      const canvas = document.createElement('canvas')

      canvas.width = img.width * scale
      canvas.height = img.height * scale

      const ctx = canvas.getContext('2d')!

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const src = cv.imread(canvas)

      const gray = new cv.Mat()

      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY)

      cv.normalize(gray, gray, 0, 255, cv.NORM_MINMAX)

      cv.imshow(canvas, gray)

      canvas.toBlob((blob) => {
        resolve(blob!)
      }, 'image/png')

      src.delete()
      gray.delete()
    }

    img.src = URL.createObjectURL(file)
  })
}
