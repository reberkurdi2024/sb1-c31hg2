import { DocumentData } from 'firebase/firestore';

export function sanitizeData<T extends Record<string, any>>(data: T, requiredFields: (keyof T)[]): T {
  const sanitized = { ...data };
  
  // Add timestamps
  sanitized.createdAt = sanitized.createdAt || new Date().toISOString();
  sanitized.updatedAt = new Date().toISOString();

  // Ensure required fields exist
  for (const field of requiredFields) {
    if (sanitized[field] === undefined || sanitized[field] === null) {
      throw new Error(`Missing required field: ${String(field)}`);
    }
  }

  return sanitized;
}

export function validateData<T extends Record<string, any>>(
  data: T,
  validations: Record<keyof T, (value: any) => boolean>
): boolean {
  for (const [key, validate] of Object.entries(validations)) {
    if (!validate(data[key as keyof T])) {
      console.error(`Validation failed for field: ${key}`);
      return false;
    }
  }
  return true;
}

export function formatDocumentData<T>(
  data: DocumentData,
  defaultValues: Partial<T>
): Omit<T, 'id'> {
  return {
    ...defaultValues,
    ...Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value ?? defaultValues[key as keyof T]
      ])
    )
  } as Omit<T, 'id'>;
}

export function isValidDate(date: string): boolean {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
}

export function isValidPrice(price: number): boolean {
  return typeof price === 'number' && price >= 0 && !isNaN(price);
}

export function isValidQuantity(quantity: number): boolean {
  return typeof quantity === 'number' && quantity >= 0 && Number.isInteger(quantity);
}

export function isValidStatus(status: string, validStatuses: string[]): boolean {
  return validStatuses.includes(status);
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
}

export function generateBarcode(): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(-2);
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const timestamp = currentDate.getTime().toString().slice(-3);
  return `${year}${month}${day}${random}${timestamp}`;
}