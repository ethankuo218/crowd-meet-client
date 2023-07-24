export function getFormatTimeString(input?: string): string {
  const date = input ? new Date(input) : new Date();
  const isoDateString = date.toLocaleDateString().split('/');
  const isMorning = date.toLocaleTimeString().split(' ')[1] === 'AM';
  const isoTimeString = date.toLocaleTimeString().split(' ')[0].split(':');

  console.log(isoTimeString);
  console.log(
    `${isoDateString[2]}-${isoDateString[0].padStart(
      2,
      '0'
    )}-${isoDateString[1].padStart(2, '0')}T${
      isMorning
        ? isoTimeString[0].padStart(2, '0')
        : Number(isoTimeString[0]) + 12
    }:${isoTimeString[1]}`
  );

  return `${isoDateString[2]}-${isoDateString[0].padStart(
    2,
    '0'
  )}-${isoDateString[1].padStart(2, '0')}T${
    isMorning
      ? isoTimeString[0].padStart(2, '0')
      : Number(isoTimeString[0]) + 12
  }:${isoTimeString[1]}`;
}
