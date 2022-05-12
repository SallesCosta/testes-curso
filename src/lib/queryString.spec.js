const { queryString, parse } = require('./queryString')

describe('Object to queryString', () => {
  it('should create a valid queryString when an object is provided', async () => {
    const obj = {
      name: 'Eduardo',
      job: 'developer',
    }

    expect(queryString(obj)).toBe('name=Eduardo&job=developer')
  })

  it('should coreate a valid query string even when an array is passed as value', async () => {
    const obj = {
      name: 'Eduardo',
      skills: ['js', 'TDD'],
    }

    expect(queryString(obj)).toBe('name=Eduardo&skills=js,TDD')
  })

  it('should throw an error when an object is passe as value ', async () => {
    const obj = {
      name: 'Eduardo',
      skills: { first: 'js', second: 'TDD' },
    }

    expect(() => {
      queryString(obj)
    }).toThrowError()
  })
})

describe('Query string to object', () => {
  it('should convert a query string to object', async () => {
    const qs = 'name=Eduardo&job=developer'
    expect(parse(qs)).toEqual({
      name: 'Eduardo',
      job: 'developer',
    })
  })

  it('should convert a query string of a single key-value pair to object', async () => {
    const qs = 'name=Eduardo'
    expect(parse(qs)).toEqual({
      name: 'Eduardo',
    })
  })

  it('should convert a query string to an object taking care of comma separated values', async () => {
    const qs = 'name=Eduardo&skills=js,TDD'
    expect(parse(qs)).toEqual({
      name: 'Eduardo',
      skills: ['js', 'TDD'] 
    })
  })
})
