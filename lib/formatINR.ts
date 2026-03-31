export function formatINR(price: string | number): string {
  if (price === null || price === undefined) return "₹0";

  // Convert to number safely
  const num = typeof price === "number" ? price : parseFloat(price);

  if (isNaN(num)) return "₹0";

  // Format using Indian locale
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(num);
}