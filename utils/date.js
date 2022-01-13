exports.format = (date) => {
  const d = new Date(date || Date.now())
  return `${d.getFullYear()}_${d.getMonth()+1}_${d.getDate()}`
}