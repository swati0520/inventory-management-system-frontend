const statusClassNames = {
  "In Stock": "border-emerald-200/25 bg-emerald-300/15 text-emerald-100",
  "Low Stock": "border-amber-200/25 bg-amber-300/15 text-amber-100",
  "Out of Stock": "border-rose-200/25 bg-rose-300/15 text-rose-100",
};

function StockStatusBadge({ status, stockStatus }) {
  const resolvedStatus = stockStatus ?? status;

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClassNames[resolvedStatus]}`}>
      {resolvedStatus}
    </span>
  );
}

export default StockStatusBadge;
