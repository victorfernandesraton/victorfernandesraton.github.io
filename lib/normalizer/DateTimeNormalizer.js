export class DateTimeNormalizer {
  static dateToTimeAgo(date) {
    const currentDate = new Date()
    const previousDate = new Date(date)

    const timeDifference = currentDate.getTime() - previousDate.getTime()
    const secondsDifference = Math.floor(timeDifference / 1000)
    const minutesDifference = Math.floor(secondsDifference / 60)
    const hoursDifference = Math.floor(minutesDifference / 60)
    const daysDifference = Math.floor(hoursDifference / 24)
    const monthsDifference = Math.floor(daysDifference / 30)
    const yearsDifference = Math.floor(daysDifference / 365)

    if (secondsDifference < 60) {
      return 'Just now'
    } else if (minutesDifference < 60) {
      return `${minutesDifference} minutes ago`
    } else if (hoursDifference < 24) {
      return `${hoursDifference} hours ago`
    } else if (daysDifference < 30) {
      return `${daysDifference} days ago`
    } else if (monthsDifference < 12) {
      return `${monthsDifference} months ago`
    }
    return `${yearsDifference} years ago`
  }
}
