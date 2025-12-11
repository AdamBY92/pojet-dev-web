const Table = ({ headers, data, actions }) => {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, i) => <th key={i}>{header}</th>)}
          {actions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {headers.map((header, j) => <td key={j}>{row[header.toLowerCase()]}</td>)}
            {actions && <td>{actions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;