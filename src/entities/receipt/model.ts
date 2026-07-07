export interface Receipt {
  items: ReceiptItem[]
  subtotal?: number
  serviceCharge?: number
  pb1?: number
  total?: number
}

export interface ReceiptItem {
  id: string
  name: string
  price: number
  quantity: number
  unitPrice: number
  assignedTo: string[]
}
