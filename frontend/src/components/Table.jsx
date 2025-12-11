import { useState } from 'react';
import './Table.css';

/**
 * DataTable générique et réutilisable
 * @param {Array} columns - Définition des colonnes [{key: 'name', label: 'Nom', sortable: true}]
 * @param {Array} data - Les données à afficher
 * @param {Function} actions - Fonction pour générer les boutons d'actions (view, edit, delete)
 * @param {number} itemsPerPage - Nombre d'éléments par page
 */
const DataTable = ({ 
  columns, 
  data, 
  actions,
  itemsPerPage = 10,
  searchableColumns = [],
  onRowClick
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrer les données par recherche
  let filteredData = data.filter(item => {
    if (!searchTerm) return true;
    return searchableColumns.some(col => 
      String(item[col]).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Trier les données
  if (sortConfig.key) {
    filteredData = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Paginer les données
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="data-table-container">
      {searchableColumns.length > 0 && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={column.sortable ? 'sortable' : ''}
                >
                  {column.label}
                  {column.sortable && sortConfig.key === column.key && (
                    <span className={`sort-indicator ${sortConfig.direction}`}>
                      {sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}
                    </span>
                  )}
                </th>
              ))}
              {actions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={onRowClick ? 'clickable' : ''}
                >
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render 
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                  {actions && <td className="actions-cell">{actions(row)}</td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="no-data">
                  Aucune donnée disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← Précédent
          </button>
          <span className="page-info">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;