import Cart from './Cart'
describe('Cart', () => {
  let cart

  let product = {
    title: 'Adidas running shoes - men',
    price: 35388,
  }

  let product2 = {
    title: 'Adidas running shoes - women',
    price: 41872,
  }

  beforeEach(() => {
    cart = new Cart()
  })

  describe('gettotal()', () => {
    it('should return 0 when getTotal() is executed in a newly created instance', () => {
      expect(cart.getTotal().getAmount()).toEqual(0)
    })

    it('should multiply quantity and price and recive the total amount', () => {
      const item = {
        product,
        quantity: 2,
      }
      cart.add(item)
      expect(cart.getTotal().getAmount()).toEqual(70776)
    })

    it('should ensure no more than one product exists at a time', () => {
      cart.add({
        product,
        quantity: 2,
      })

      cart.add({
        product,
        quantity: 1,
      })

      expect(cart.getTotal().getAmount()).toEqual(35388)
    })

    it('shoul update total when a product gets included and then remove', () => {
      cart.add({
        product,
        quantity: 2,
      })

      cart.add({
        product: product2,
        quantity: 1, // 112.648
      })

      cart.remove(product)
      expect(cart.getTotal().getAmount()).toEqual(41872)
    })
  })

  describe('checkout()', () => {
    it('should return an object with the total and the list of items', () => {
      cart.add({
        product,
        quantity: 2,
      })

      cart.add({
        product: product2,
        quantity: 3,
      })

      expect(cart.checkout()).toMatchSnapshot()
    })

    it('should reset the cart when checktou() is called', () => {
      cart.add({
        product: product2,
        quantity: 3,
      })
      cart.checkout()
      expect(cart.getTotal().getAmount()).toEqual(0)
    })

    it('should return an object with the total and the list fo items when summary() is called)', async () => {
      cart.add({
        product,
        quantity: 2,
      })

      cart.add({
        product: product2,
        quantity: 3,
      })

      expect(cart.summary()).toMatchSnapshot()
      expect(cart.getTotal().getAmount()).toBeGreaterThan(0)
    })
  })

  describe('special conditions', () => {
    it('should NOT apply percentage discount quantity is below or equals minimum', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      }

      cart.add({
        product,
        condition,
        quantity: 2,
      })

      expect(cart.getTotal().getAmount()).toEqual(70776)
    })

    it('should apply percentage discount quantity above minimum in passed', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      }

      cart.add({
        product,
        condition,
        quantity: 3,
      })

      expect(cart.getTotal().getAmount()).toEqual(74315)
    })

    it('should aplly quantity discount for even quantities when condition in no met', async () => {
      const condition = {
        quantity: 2,
      }

      cart.add({
        product,
        condition,
        quantity: 1,
      })

      expect(cart.getTotal().getAmount()).toEqual(35388)
    })

    it('should aplly quantity discount for even quantities', async () => {
      const condition = {
        quantity: 2,
      }

      cart.add({
        product,
        condition,
        quantity: 4,
      })

      expect(cart.getTotal().getAmount()).toEqual(70776)
    })

    it('should aplly quantity discount for odd quantities', async () => {
      const condition = {
        quantity: 2,
      }

      cart.add({
        product,
        condition,
        quantity: 5,
      })

      expect(cart.getTotal().getAmount()).toEqual(106164)
    })

    it('should receive two or more conditions and determine/apply the best discount. First case', async () => {
      const condition1 = {
        percentage: 30,
        minimum: 2,
      }
      const condition2 = {
        quantity: 2,
      }
      cart.add({
        product,
        consition: [condition1, condition2],
        quaitty: 5,
      })
      expect(cart.getTotal().getAmount().toEqual(106164))
    })
  })
})
