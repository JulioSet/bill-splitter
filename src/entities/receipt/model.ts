export interface Receipt {
  items: ReceiptItem[]
  subtotal?: number
  serviceCharge?: number
  pb1?: number
  serviceChargeAmount?: number
  pb1Amount?: number
  total?: number
  warnings?: string[]
}

export interface ReceiptItem {
  id: string
  name: string
  price: number
  quantity: number
  unitPrice: number
  assignedTo: string[]
}
