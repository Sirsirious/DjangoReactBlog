export const ISODateToDate = (ISODate) => {
  const date = new Date(ISODate);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
