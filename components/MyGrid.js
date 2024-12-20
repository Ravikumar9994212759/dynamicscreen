import React, { useState } from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button } from '@mui/material'; // For Add Button
import '@progress/kendo-theme-default/dist/all.css'; // Import KendoReact default theme

const MyGrid = () => {
  // Initial data
  const initialData = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 },
    { id: 3, name: 'Samuel Johnson', age: 35 },
    { id: 4, name: 'Michael Brown', age: 40 },
    { id: 5, name: 'Emma White', age: 22 },
  ];

  const [gridData, setGridData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  // Handle Add Row
  const handleAddRow = () => {
    const newRow = { id: gridData.length + 1, name: '', age: 0 };
    setGridData([...gridData, newRow]);
    setIsEditing(true); // Start editing the new row
    setCurrentRow(newRow);
  };

  // Handle Edit Row
  const handleEditRow = (event) => {
    const row = event.dataItem;
    setIsEditing(true);
    setCurrentRow({ ...row });
  };

  // Handle Save Row
  const handleSaveRow = () => {
    setGridData((prevData) =>
      prevData.map((item) =>
        item.id === currentRow.id ? { ...currentRow } : item
      )
    );
    setIsEditing(false);
    setCurrentRow(null);
  };

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentRow(null);
  };

  // Handle Delete Row
  const handleDeleteRow = (id) => {
    setGridData(gridData.filter((item) => item.id !== id));
  };

  // Handle row data change during editing
  const handleRowChange = (e) => {
    const { name, value } = e.target;
    setCurrentRow((prevRow) => ({
      ...prevRow,
      [name]: value,
    }));
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>

      {/* Add Row Button */}
      <Button variant="contained" color="primary" onClick={handleAddRow} style={{ marginBottom: '20px' }}>
        Add New Row
      </Button>

      {/* Grid with responsive container */}
      <Grid
        data={gridData} // Bind to grid data
        pageable={true}
        sortable={true}
        filterable={true} // Enable filtering for columns
        onRowClick={handleEditRow} // Enable row click for edit
        style={{ width: '100%', border: 'none' }} // Grid takes 100% width of its container
      >
        {/* Column Definitions */}
        <GridColumn field="id" title="ID" />
        <GridColumn field="name" title="Name" />
        <GridColumn field="age" title="Age" />

        {/* Actions Column for Edit and Delete buttons */}
        <GridColumn
          title="Actions"
          cell={(props) => {
            const { dataItem } = props;
            return (
              <td>
                {/* Edit Button */}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEditRow(props)}
                  style={{ marginRight: 10 }}
                >
                  Edit
                </Button>

                {/* Delete Button */}
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDeleteRow(dataItem.id)}
                >
                  Delete
                </Button>
              </td>
            );
          }}
        />
      </Grid>

      {/* Edit Row Modal */}
      {isEditing && currentRow && (
        <div className="edit-form">
          <h2>Edit Row</h2>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={currentRow.name}
              onChange={handleRowChange}
            />
          </label>
          <label>
            Age:
            <input
              type="number"
              name="age"
              value={currentRow.age}
              onChange={handleRowChange}
            />
          </label>
          <div className="actions">
            <Button onClick={handleSaveRow} variant="contained" color="primary">
              Save
            </Button>
            <Button onClick={handleCancelEdit} variant="contained" color="secondary">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <style jsx>{`
        .edit-form {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 20px;
          background: white;
          border: 1px solid #ddd;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }

        .edit-form input {
          margin-bottom: 10px;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }

        .actions {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
        }

        /* Ensure no extra borders or background are added */
        .k-grid {
          background: transparent !important;
          border: none !important;
        }

        /* Optional: Add styles for modal and content */
        .k-grid-container {
          margin: 0;
          padding: 0;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default MyGrid;
