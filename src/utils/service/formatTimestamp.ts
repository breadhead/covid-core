export const formatTimestamp = (ms: number) => {
  const hours = Math.round(ms / 1000 / 60 / 60)

  if (hours > 24) {
    const hoursAfterDays = hours % 24
    const days = Math.trunc(hours / 24)

    return `${days} д. ${hoursAfterDays} ч.`
  }

  return `${hours} ч.`
}
