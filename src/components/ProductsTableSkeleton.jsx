const skeletonRows = Array.from({ length: 5 }, (_, index) => index);
const skeletonColumns = Array.from({ length: 7 }, (_, index) => index);

function ProductsTableSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-white/[0.09] shadow-xl shadow-black/15 backdrop-blur-md">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-white/10 bg-white/[0.04]">
            <tr>
              {skeletonColumns.map((column) => <th key={column} className="px-5 py-4"><div className="h-3 rounded bg-white/10" /></th>)}
            </tr>
          </thead>
          <tbody>
            {skeletonRows.map((row) => (
              <tr key={row} className="border-b border-white/10 last:border-0">
                {skeletonColumns.map((column) => <td key={column} className="px-5 py-5"><div className="h-4 rounded bg-white/10" /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-4 p-4 md:hidden">
        {skeletonRows.slice(0, 3).map((row) => <div key={row} className="h-44 rounded-xl bg-white/10" />)}
      </div>
    </div>
  );
}

export default ProductsTableSkeleton;
