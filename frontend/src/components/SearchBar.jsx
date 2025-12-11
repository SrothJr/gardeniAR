function SearchBar({ value, onChange }) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search plants..."
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 text-slate-800 placeholder-slate-400 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
      />

    </div>
  );
}

export default SearchBar;
