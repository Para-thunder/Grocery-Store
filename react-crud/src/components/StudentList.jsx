import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    setError(null);
    setLoading(true);

    fetch('http://localhost:4000/api/student', { method: 'GET' })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch students');
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Unexpected response format');
        setStudents(data);
      })
      .catch((err) => {
        console.error('Fetch Error:', err);
        setError(err);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/api/student/${id}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) throw new Error('Delete failed');
        fetchStudents();
        return response.json();
      })
      .then(() => {
        setStudents((prevStudents) => prevStudents.filter((s) => s.id !== id));
      })
      .catch((err) => {
        console.error('Error deleting student:', err);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error.message}</p>;

  return (
    <div>
      <h2>Student List</h2>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.first_name || "N/A"}</td>
                <td>{student.last_name || "N/A"}</td>
                <td>{student.email || "N/A"}</td>
                <td>
                  <Link to={`/edit/${student.id}`}>Edit</Link>
                  <button
                    onClick={() => handleDelete(student.id)}
                    style={{ marginLeft: '10px', color: 'red' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/add" style={{ display: 'block', marginTop: '20px' }}>
        Add New Student
      </Link>
    </div>
  );
}

export default StudentList;
