import { describe, it, expect } from 'vitest'

describe('Basic Test', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should test array operations', () => {
    const arr = [1, 2, 3]
    expect(arr).toHaveLength(3)
    expect(arr).toContain(2)
  })

  it('should test object properties', () => {
    const obj = { name: 'test', value: 42 }
    expect(obj).toHaveProperty('name')
    expect(obj.name).toBe('test')
    expect(obj.value).toBe(42)
  })
})