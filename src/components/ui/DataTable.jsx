import './DataTable.css';

export default function DataTable({ columns, data, onRowClick, emptyMessage = 'No records found.' }) {
  if (!data || data.length === 0) {
    return (
      <div className="data-table-container" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={col.key || idx} style={col.width ? { width: col.width } : undefined}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={row.id || rowIdx}
              className={onRowClick ? 'clickable' : ''}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col, colIdx) => (
                <td key={col.key || colIdx}>
                  {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
