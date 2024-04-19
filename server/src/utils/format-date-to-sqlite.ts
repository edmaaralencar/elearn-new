import dayjs from 'dayjs'

export function formatDateToSqlite(date: Date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}
