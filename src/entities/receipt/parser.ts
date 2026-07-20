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
  'change',
  'kembali',
  'discount',
  'diskon',
  'member',
  'card',
  'debit',
  'credit',
  'kredit',
  'debit',
  'nfc',
  'qris',
  'thank',
  'terima',
  'kasih',
  'item',
  'qty',
  'price',
  'harga',
  'jumlah',
  'total',
  'subtotal',
  'tunai',
  'kembalian',
  'pajak',
  'dibayar',
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
    .replace(/^[xX]\s*/, '')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim()
}

export function parseReceipt(text: string): Receipt {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const warnings: string[] = []

  const items: ReceiptItem[] = []

  let subtotal: number | undefined
  let serviceChargeAmount: number | undefined
  let pb1Amount: number | undefined
  let total: number | undefined

  for (const line of lines) {
    const lowerLine = line.toLowerCase()

    const priceMatch = line.match(/([\d.,]+)$/)

    if (priceMatch?.[1]) {
      const value = parsePrice(priceMatch[1])

      if (lowerLine.startsWith('subtotal')) {
        subtotal = value
        continue
      }

      if (lowerLine.startsWith('service') || lowerLine.startsWith('serv')) {
        serviceChargeAmount = value
        continue
      }

      if (lowerLine.startsWith('pb1') || lowerLine.startsWith('pbi')) {
        pb1Amount = value
        continue
      }

      if (/^total\s/i.test(lowerLine)) {
        total = value
        continue
      }
    }

    if (ignoredWords.some((word) => lowerLine.startsWith(word))) {
      continue
    }

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

    const name = normalizeName(rawName)

    if (!name) {
      continue
    }

    const existing = items.find((i) => i.name === name)

    if (existing) {
      existing.quantity += qty
      existing.price += price
      existing.unitPrice = existing.price / existing.quantity
    } else {
      items.push({
        id: crypto.randomUUID(),
        name,
        price,
        unitPrice: price / qty,
        quantity: qty,
        assignedTo: [],
      })
    }
  }

  if (subtotal !== undefined) {
    const sumPrices = items.reduce((sum, item) => sum + item.price, 0)
    const diff = Math.abs(sumPrices - subtotal)

    if (diff > 0) {
      warnings.push(
        `Sum of items (${sumPrices.toLocaleString('en-US')}) differs from subtotal (${subtotal.toLocaleString('en-US')}) by ${diff.toLocaleString('en-US')}.`,
      )
    }
  }

  return {
    items,
    subtotal,
    serviceChargeAmount,
    pb1Amount,
    total,
    warnings: warnings.length > 0 ? warnings : undefined,
  }
}
