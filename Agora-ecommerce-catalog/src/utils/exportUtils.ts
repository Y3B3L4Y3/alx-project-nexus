// Export Utilities - Functions to export data as CSV or JSON

/**
 * Export data as JSON file
 */
export const exportToJSON = <T>(data: T[], filename: string): void => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadFile(blob, `${filename}.json`);
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw new Error('Failed to export data as JSON');
  }
};

/**
 * Export data as CSV file
 */
export const exportToCSV = <T extends object>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
): void => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    // Get headers from columns or from first data item
    const headers = columns
      ? columns.map((col) => col.label)
      : Object.keys(data[0]);

    const keys = columns
      ? columns.map((col) => col.key)
      : (Object.keys(data[0]) as (keyof T)[]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        keys
          .map((key) => {
            const value = row[key];
            // Handle values with commas, quotes, or newlines
            if (value === null || value === undefined) return '';
            const stringValue = String(value);
            if (
              stringValue.includes(',') ||
              stringValue.includes('"') ||
              stringValue.includes('\n')
            ) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `${filename}.csv`);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw new Error('Failed to export data as CSV');
  }
};

/**
 * Helper function to download a file
 */
const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export products to CSV with specific columns
 */
export const exportProductsToCSV = <T extends object>(products: T[]): void => {
  const columns = [
    { key: 'id' as keyof T, label: 'ID' },
    { key: 'title' as keyof T, label: 'Product Name' },
    { key: 'sku' as keyof T, label: 'SKU' },
    { key: 'category' as keyof T, label: 'Category' },
    { key: 'price' as keyof T, label: 'Price' },
    { key: 'stock' as keyof T, label: 'Stock' },
    { key: 'status' as keyof T, label: 'Status' },
  ];
  exportToCSV(products, `products_${getDateString()}`, columns);
};

/**
 * Export orders to CSV with specific columns
 */
export const exportOrdersToCSV = <T extends object>(orders: T[]): void => {
  const columns = [
    { key: 'id' as keyof T, label: 'Order ID' },
    { key: 'customer' as keyof T, label: 'Customer' },
    { key: 'email' as keyof T, label: 'Email' },
    { key: 'product' as keyof T, label: 'Product' },
    { key: 'amount' as keyof T, label: 'Amount' },
    { key: 'status' as keyof T, label: 'Status' },
    { key: 'date' as keyof T, label: 'Date' },
  ];
  exportToCSV(orders, `orders_${getDateString()}`, columns);
};

/**
 * Export users to CSV with specific columns
 */
export const exportUsersToCSV = <T extends object>(users: T[]): void => {
  const columns = [
    { key: 'id' as keyof T, label: 'User ID' },
    { key: 'name' as keyof T, label: 'Name' },
    { key: 'email' as keyof T, label: 'Email' },
    { key: 'role' as keyof T, label: 'Role' },
    { key: 'status' as keyof T, label: 'Status' },
    { key: 'joinDate' as keyof T, label: 'Join Date' },
    { key: 'orders' as keyof T, label: 'Total Orders' },
  ];
  exportToCSV(users, `users_${getDateString()}`, columns);
};

/**
 * Export messages to CSV with specific columns
 */
export const exportMessagesToCSV = <T extends object>(messages: T[]): void => {
  const columns = [
    { key: 'id' as keyof T, label: 'Message ID' },
    { key: 'name' as keyof T, label: 'From' },
    { key: 'email' as keyof T, label: 'Email' },
    { key: 'subject' as keyof T, label: 'Subject' },
    { key: 'status' as keyof T, label: 'Status' },
    { key: 'date' as keyof T, label: 'Date' },
    { key: 'priority' as keyof T, label: 'Priority' },
  ];
  exportToCSV(messages, `messages_${getDateString()}`, columns);
};

/**
 * Get current date string for filename
 */
const getDateString = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
