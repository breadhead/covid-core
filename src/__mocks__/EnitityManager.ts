export const mockSave = jest.fn()

const mock = jest.fn().mockImplementation(() => ({
  save: mockSave,
  transaction: (callback) => {
    return callback(new mock())
  },
}))

export default mock
