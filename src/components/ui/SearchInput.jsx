import { Search } from 'lucide-react';
import './SearchInput.css';

export default function SearchInput({ value, onChange, placeholder = 'Search...', className = '', ...props }) {
  return (
    <div className={`search-input-wrapper ${className}`.trim()}>
      <Search size={16} className="search-input-icon" />
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}
