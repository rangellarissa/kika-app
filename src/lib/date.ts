// novidade.data is stored as dd/mm/yyyy text; <input type="date"> uses yyyy-mm-dd.
export const toInputDate = (display: string): string => {
    const [day, month, year] = display.split('/')
    return day && month && year ? `${year}-${month}-${day}` : ''
}

export const toDisplayDate = (input: string): string => {
    const [year, month, day] = input.split('-')
    return day && month && year ? `${day}/${month}/${year}` : ''
}

// Timestamp used to sort dd/mm/yyyy dates; NaN when the text is not a valid date.
export const displayDateValue = (display: string): number => new Date(toInputDate(display)).getTime()

// artista.date is stored as mm/yyyy text; <input type="month"> uses yyyy-mm.
export const toInputMonth = (display: string): string => {
    const [month, year] = display.split('/')
    return month && year ? `${year}-${month}` : ''
}

export const toDisplayMonth = (input: string): string => {
    const [year, month] = input.split('-')
    return month && year ? `${month}/${year}` : ''
}
