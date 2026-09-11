export const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

export const validateLogin = ({ email, password }) => {
  if (!email.trim() || !password) return "Email and password are required.";
  if (!isValidEmail(email.trim())) return "Enter a valid email address.";

  return "";
};

export const validateRegistration = ({ name, email, password, confirmPassword }) => {
  const errors = {};

  if (!name.trim()) errors.name = "Name is required.";

  if (!email.trim()) errors.email = "Email is required.";
  else if (!isValidEmail(email.trim())) errors.email = "Enter a valid email address.";

  if (!password) errors.password = "Password is required.";
  else if (password.length < 6) errors.password = "Password must be at least 6 characters.";

  if (!confirmPassword) errors.confirmPassword = "Please confirm your password.";
  else if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";

  return errors;
};

export const validateProduct = (product) => {
  const validationErrors = {};
  const quantity = Number(product.quantity);
  const unitPrice = Number(product.unitPrice);

  if (!product.name.trim()) validationErrors.name = "Product name is required.";
  if (!product.sku.trim()) validationErrors.sku = "SKU is required.";
  if (!product.category) validationErrors.category = "Please select a category.";
  if (!product.stockStatus) validationErrors.stockStatus = "Please select a stock status.";
  if (product.quantity === "") validationErrors.quantity = "Quantity is required.";
  else if (!Number.isInteger(quantity) || quantity < 0) validationErrors.quantity = "Quantity must be a whole number of zero or more.";
  if (product.unitPrice === "") validationErrors.unitPrice = "Unit price is required.";
  else if (!Number.isFinite(unitPrice) || unitPrice < 0) validationErrors.unitPrice = "Unit price cannot be negative.";
  if (!product.supplierName.trim()) validationErrors.supplierName = "Supplier name is required.";

  return validationErrors;
};

export const validateCategory = (category) => {
  if (!category.name.trim()) return "Category name is required.";

  return "";
};

export const validateStockAdjustmentQuantity = (quantity) => {
  const value = Number(quantity);
  return !Number.isInteger(value) || value < 1 ? "Enter a whole number greater than zero." : "";
};
