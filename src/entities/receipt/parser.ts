import type { Receipt, ReceiptItem } from './model'

const ignoredWords = [
  'cash',
  'payment',
  'visa',
  'signature',
  'name',
  'totalitem',
  'totalqty',
  'bnivisa',
]

function parsePrice(value: string): number {
  return Number(value.replace(/rp/gi, '').replace(/[.,]/g, '').trim())
}

function normalizeName(value: string): string {
  return value
    .replace(/^1(?=[A-Za-z])/i, '')
    .replace(/^I(?=[A-Za-z])/i, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim()
}

export function parseReceipt(text: string): Receipt {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const items: ReceiptItem[] = []

  let subtotal: number | undefined
  let serviceCharge: number | undefined
  let pb1: number | undefined
  let total: number | undefined

  for (const line of lines) {
    const lowerLine = line.toLowerCase()

    const priceMatch = line.match(/([\d.,]+)$/)

    /**
     * Summary fields
     */
    if (priceMatch?.[1]) {
      const value = parsePrice(priceMatch[1])

      if (lowerLine.startsWith('subtotal')) {
        subtotal = value
        continue
      }

      // if (lowerLine.startsWith('service') || lowerLine.startsWith('serv')) {
      //   serviceCharge = value
      //   continue
      // }

      // if (lowerLine.startsWith('pb1') || lowerLine.startsWith('pbi')) {
      //   pb1 = value
      //   continue
      // }

      if (/^total\s/i.test(lowerLine)) {
        total = value
        continue
      }
    }

    /**
     * Ignore footer/header
     */
    if (ignoredWords.some((word) => lowerLine.startsWith(word))) {
      continue
    }

    /**
     * Item:
     * 1BolaBolaSusu 79,000
     * BolaBolaSusu 79,000
     * 2 Bola Bola Susu 79,000
     */
    const itemMatch = line.match(/^(?:(\d+)\s*)?(.+?)\s+(?:rp)?\s*([\d.,]+)$/i)

    if (!itemMatch) {
      continue
    }

    const qty = Number(itemMatch[1] ?? 1)
    const rawName = itemMatch[2]
    const rawPrice = itemMatch[3]

    if (!rawName || !rawPrice) {
      continue
    }

    const price = parsePrice(rawPrice)

    if (!Number.isFinite(price)) {
      continue
    }

    items.push({
      id: crypto.randomUUID(),
      name: normalizeName(rawName),
      price: price,
      unitPrice: price / qty,
      quantity: qty,
      assignedTo: [],
    })
  }

  return {
    items,
    subtotal,
    serviceCharge,
    pb1,
    total,
  }
}
