import EditableField from "./EditableField";

const Table = () => {
    const [editRowId, setEditRowId] = useState(null); // Track which row is being edited
  
    const handleEditToggle = (id) => {
      setEditRowId(editRowId === id ? null : id); // Toggle editing for the row
    };
  
    return (
      <tbody>
        {filteredSubmissions.map((submission) => (
          <tr key={submission.id}>
            <td>{submission.sn}</td>
            <td>
              <EditableField
                value={submission.old_oracle_id}
                id={submission.id}
                field="old_oracle_id"
                onSave={handleEdit}
                isEditing={editRowId === submission.id}
                onEditToggle={(isEditing) => handleEditToggle(isEditing ? submission.id : null)}
              />
            </td>
            <td>
              <EditableField
                value={submission.staff_employer}
                id={submission.id}
                field="staff_employer"
                onSave={handleEdit}
                isEditing={editRowId === submission.id}
                onEditToggle={(isEditing) => handleEditToggle(isEditing ? submission.id : null)}
              />
            </td>
            <td>
              <EditableField
                value={submission.new_oracle_id}
                id={submission.id}
                field="new_oracle_id"
                onSave={handleEdit}
                isEditing={editRowId === submission.id}
                onEditToggle={(isEditing) => handleEditToggle(isEditing ? submission.id : null)}
              />
            </td>
            <td>
              <EditableField
                value={submission.cuid}
                id={submission.id}
                field="cuid"
                onSave={handleEdit}
                isEditing={editRowId === submission.id}
                onEditToggle={(isEditing) => handleEditToggle(isEditing ? submission.id : null)}
              />
            </td>
            <td>
              <EditableField
                value={submission.names}
                id={submission.id}
                field="names"
                onSave={handleEdit}
                isEditing={editRowId === submission.id}
                onEditToggle={(isEditing) => handleEditToggle(isEditing ? submission.id : null)}
              />
            </td>
            <td>
              <button
                onClick={() => handleEditToggle(submission.id)}
                className={`${
                  editRowId === submission.id ? "bg-yellow-500" : "bg-blue-500"
                } hover:bg-blue-700 text-white font-bold py-1 px-4 rounded`}
              >
                {editRowId === submission.id ? "Disable Editing" : "Enable Editing"}
              </button>
            </td>
            <td>
              <button
                onClick={() => handleDelete(submission.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };
  