const mock = jest.fn().mockImplementation(() => ({
  emit: jest.fn(),
}))

export default mock
