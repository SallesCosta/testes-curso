import find from 'lodash/find'
import remove from 'lodash/remove'
import Dinero from 'dinero.js'

const Money = Dinero

const calculateDiscount = (amount, quantity, condition) => {
  const list = Array.isArray(condition) ? condition : [condition]

  const [higherDiscount] = list
    .map(cond => {
      if (cond.percentage) {
        return calculatePercentageDiscount(amount, {
          condition: cond,
          quantity,
        }).getAmount()
      } else if (cond.quantity) {
        return calculateQuantityDiscount(amount, {
          condition: cond,
          quantity,
        }).getAmount()
      }
    })
    .sort((a, b) => b - a)

  return Money({amount: higherDiscount})
}

const calculatePercentageDiscount = (amount, item) => {
  if (item.condition?.percentage && item.quantity > item.condition.minimum) {
    return amount.percentage(item.condition.percentage)
  }
  return Money({ amount: 0 })
}

const calculateQuantityDiscount = (amount, item) => {
  const isEven = item.quantity % 2 === 0

  if (item.condition?.quantity && item.quantity > item.condition.quantity) {
    return amount.percentage(isEven ? 50 : 40)
  }
  return Money({ amount: 0 })
}

Money.defaultCurrency = 'BRL'
Money.defaultPrecision = 2

export default class Cart {
  items = []

  getTotal() {
    return this.items.reduce((acc, item) => {
      const amount = Money({ amount: item.quantity * item.product.price })

      let discount = Money({ amount: 0 })

      if (item.condition) {
        discount = calculateDiscount(amount, item.quantity, item.condition)
      }
      // if (item.condition?.percentage) {
      //   discount = calculatePercentageDiscount(amount, item)
      // } else if (item.condition?.quantity) {
      //   discount = calculateQuantityDiscount(amount, item)
      // }

      return acc.add(amount).subtract(discount)
    }, Money({ amount: 0 }))
  }

  add(item) {
    const itemToFind = { product: item.product }
    if (find(this.items, itemToFind)) {
      remove(this.items, itemToFind)
    }
    this.items.push(item)
  }

  remove(product) {
    remove(this.items, { product })
  }

  summary() {
    const total = this.getTotal().getAmount()
    const items = this.items

    return {
      total,
      items,
    }
  }

  checkout() {
    const { total, items } = this.summary()

    this.items = []

    return {
      total,
      items,
    }
  }
}

const cart = new Cart()

const product = {
  title: '',
  price: '',
}

const item = {
  quantity: 2,
  product,
}

cart.add(item)
cart.remove(product)
cart.getTotal()
cart.summary()
cart.checkout()
