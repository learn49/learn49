import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears
} from 'date-fns'

export const handleTimeDifference = (now, createdAt) => {
  const diffInSeconds = differenceInSeconds(new Date(now), new Date(createdAt))
  const diffInMinutes = differenceInMinutes(new Date(now), new Date(createdAt))
  const diffInHours = differenceInHours(new Date(now), new Date(createdAt))
  const diffInDays = differenceInDays(new Date(now), new Date(createdAt))
  const diffInMonths = differenceInMonths(new Date(now), new Date(createdAt))
  const diffInYears = differenceInYears(new Date(now), new Date(createdAt))

  if (diffInSeconds < 60) {
    return `${diffInSeconds} segundos atrás`
  } else if (diffInMinutes < 60) {
    return (
      diffInMinutes + (diffInMinutes > 1 ? ' minutos' : ' minuto') + ' atrás'
    )
  } else if (diffInHours < 24) {
    return diffInHours + (diffInHours > 1 ? ' horas' : ' hora') + ' atrás'
  } else if (diffInDays < 30) {
    return diffInDays + (diffInDays > 1 ? ' dias' : ' dia') + ' atrás'
  } else if (diffInMonths < 12) {
    return diffInMonths + (diffInMonths > 1 ? ' meses' : ' mês') + 'atrás'
  } else {
    return diffInYears + (diffInYears === 1 ? ' anos' : ' ano') + 'atrás'
  }
}
