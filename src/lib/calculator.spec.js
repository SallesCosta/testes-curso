// const { sum } = require('./calculator')
const sum = (a, b) => {
  const int1 = parseInt(a, 10)
  const int2 = parseInt(b, 10)
  if (Number.isNaN(int1) || Number.isNaN(int2)) {
    throw new Error('Please, check your input data')
  }
  return int1 + int2 
}

it('should sum 2 + 2 and the result must be 4', () => {
  expect(sum(2, 2)).toBe(4)
})

it('should sum 2 + 2 even one of them is a string and the result must be 4', () => {
  expect(sum('2', '2')).toBe(4)
})

it('should throw an error if what is provided to the method cannot be summed', async () => {
  expect(() => {
    sum('', '2')
  }).toThrowError()

  expect(() => {
    sum(['', '2'])
  }).toThrowError()

  expect(() => {
    sum({})
  }).toThrowError()

  expect(() => {
    sum()
  }).toThrowError()
})
