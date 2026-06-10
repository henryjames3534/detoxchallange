import {
  formatDateEastern,
  formatDateTimeEastern,
} from "@/lib/timezone";

export function formatDateTime(value: string | Date) {
  return formatDateTimeEastern(value);
}

export function formatDate(value: string | Date) {
  return formatDateEastern(value);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function patientName(first: string, last: string) {
  return `${first} ${last}`.trim();
}
