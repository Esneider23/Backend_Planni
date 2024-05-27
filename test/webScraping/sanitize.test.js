import { sanitize } from "../../src/utils/webScraping/sanitize"

describe('sanitize function', () => {
  it('should sanitize title and convert price to number', () => {
    const info = {
      title: '  Hotel OZ Luxury  ',
      price: 261660
    }

    const result = sanitize(info)

    expect(result.title).toBe('Hotel OZ Luxury')
    expect(result.price).toBe(261660)
  })

  it('should handle price as string and remove non-numeric characters', () => {
    const info = {
      title: 'Hotel OZ Luxury',
      price: '$261,660'
    }

    const result = sanitize(info)

    expect(result.title).toBe('Hotel OZ Luxury')
    expect(result.price).toBe(261660)
  })

  it('should handle price as number and remove non-numeric characters', () => {
    const info = {
      title: 'Hotel OZ Luxury',
      price: 261660.99
    }

    const result = sanitize(info)

    expect(result.title).toBe('Hotel OZ Luxury')
    expect(result.price).toBe(26166099)
  })

  it('should handle empty title and return sanitized price', () => {
    const info = {
      title: '',
      price: 'COP 261,660'
    }

    const result = sanitize(info)

    expect(result.title).toBe('')
    expect(result.price).toBe(261660)
  })
})
