export function formatDate(inputDate: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = new Date(inputDate).toLocaleDateString(
    "en-US",
    options
  );

  const day = new Date(inputDate).getDate();
  const daySuffix =
    day >= 11 && day <= 13
      ? "th"
      : day % 10 === 1
      ? "st"
      : day % 10 === 2
      ? "nd"
      : day % 10 === 3
      ? "rd"
      : "th";

  return formattedDate.replace(/\d{1,2}(st|nd|rd|th)/, day + daySuffix);
}

export function formatDateToDefault(formattedDate: string) {
  // Split the formatted date into parts
  const parts = formattedDate.split(" ");

  // Extract month, day, and year
  const month = parts[0];
  const day = parseInt(parts[1].slice(0, -1)); // Remove the comma and convert to number
  const year = parseInt(parts[2]);

  const date = new Date(`${month} ${day}, ${year}`);

  return date;
}
