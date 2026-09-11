const StatCard = ({ title, value, icon: Icon, iconClassName }) => {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-5 shadow-xl shadow-black/15 backdrop-blur-md transition duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015] hover:bg-white/[0.14] hover:shadow-2xl hover:shadow-indigo-950/30">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white/70">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
        </div>

        <span className={`rounded-xl border border-white/15 p-3 shadow-inner shadow-white/10 transition-transform duration-300 group-hover:scale-110 ${iconClassName}`}>
          <Icon size={22} strokeWidth={2} />
        </span>
      </div>
    </article>
  );
};

export default StatCard;
