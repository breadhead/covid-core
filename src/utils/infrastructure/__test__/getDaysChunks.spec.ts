// import { getDaysChunks } from '../getDaysChunks'
// import { eachDay } from 'date-fns'

// const CHUNK_SIZE = 5

// describe('getDaysChunks', () => {
//   test('should return arr with 7 chunks', () => {
//     const start = new Date('2019-06-01T13:11:41.564Z')
//     const end = new Date('2019-07-01T13:11:41.564Z')

//     const days = eachDay(start, end)
//     const actual = getDaysChunks(days, CHUNK_SIZE)
//     expect(actual.length).toBe(7)
//   })
//   test('should return arr with 1 chunk', () => {
//     const start = new Date('2019-06-01T13:11:41.564Z')
//     const end = new Date('2019-06-03T13:11:41.564Z')

//     const days = eachDay(start, end)
//     const actual = getDaysChunks(days, CHUNK_SIZE)
//     expect(actual.length).toBe(1)
//   })
//   test('should return arr with 2 chunks', () => {
//     const start = new Date('2019-06-01T13:11:41.564Z')
//     const end = new Date('2019-06-06T13:11:41.564Z')

//     const days = eachDay(start, end)
//     const actual = getDaysChunks(days, CHUNK_SIZE)
//     expect(actual.length).toBe(2)
//   })
// })
