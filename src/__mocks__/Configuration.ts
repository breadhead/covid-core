import { Option } from "tsoption"

const mock = jest.fn().mockImplementation(() => ({
  get: (key) => {
    return Option.of(key)
  },
}))

export default mock
