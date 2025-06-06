export function exportToXLSXS(dataValue, filename, datefrom, dateto) {
    datefrom = moment(datefrom).format('MMDDYYYY')
    dateto = moment(dateto).format('MMDDYYYY')
    let to_exel = []
    for (const data of dataValue) {
      to_exel.push({
        "DATE": data.date,
        "SCREENING DATE": data.screening,
        "SCREENING TIME": data.time,
        "REFERENCE #": data.or_number,
        "THEATER": data.theater,
        "TERMINAL": data.terminal,
        "PAYMENT": data.payment,
        "STATUS": data.status,
        "VOID REFERENCE #": data.void_or,
        "AMOUNT": data.amount,
      })
    }
  
    let dataSheet = xlsx.utils.json_to_sheet(to_exel)
    let workBook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workBook, dataSheet, 'data')
    xlsx.writeFile(workBook, `${filename}_${datefrom}-${dateto}.xlsx`)
  
  }
  