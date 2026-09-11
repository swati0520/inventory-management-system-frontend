import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { decreaseStock, increaseStock } from "../services/inventoryService";
import { validateStockAdjustmentQuantity } from "../utils/validation";

function StockAdjustmentControls({ productId, onUpdated }) {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const adjustStock = async (adjustment) => {
    const validationError = validateStockAdjustmentQuantity(quantity);
    if (validationError) {
      setError(validationError);
      return;
    }

    const value = Number(quantity);

    try {
      setIsSubmitting(true);
      setError("");
      await adjustment(productId, value);
      await onUpdated();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to update stock.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <section className="mt-8 border-t border-white/10 pt-8"><p className="text-sm font-semibold text-white/90">Adjust inventory</p><div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end"><label className="block"><span className="mb-2 block text-sm text-white/65">Quantity</span><input type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} disabled={isSubmitting} className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-200/80 focus:ring-2 focus:ring-indigo-200/30 sm:w-32" /></label><div className="flex gap-3"><button type="button" disabled={isSubmitting} onClick={() => adjustStock(increaseStock)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"><Plus size={17} /> Add stock</button><button type="button" disabled={isSubmitting} onClick={() => adjustStock(decreaseStock)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"><Minus size={17} /> Remove stock</button></div></div>{error && <p role="alert" className="mt-3 text-sm text-rose-200">{error}</p>}</section>;
}

export default StockAdjustmentControls;
