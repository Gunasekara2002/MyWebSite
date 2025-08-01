/*'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function EmployeeWorkPlanForm() {
  const [form, setForm] = useState({
    employeeName: '',
    position: '',
    year: new Date().getFullYear(),
    projectTitle: '',
    description: '',
    duration: '',
    outcome: '',
  });

  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios.get('/api/workplans').then(res => setRecords(res.data));
  }, []);

  const handleChange = ({ target }) =>
    setForm({ ...form, [target.name]: target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('/api/workplans', form);
    const res = await axios.get('/api/workplans');
    setRecords(res.data);

    setForm({
      employeeName: '',
      position: '',
      year: new Date().getFullYear(),
      projectTitle: '',
      description: '',
      duration: '',
      outcome: '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">Annual Work Plan Form</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Employee Name" name="employeeName" value={form.employeeName} onChange={handleChange} />
          <Input label="Position" name="position" value={form.position} onChange={handleChange} />
          <Input label="Year" type="number" name="year" value={form.year} onChange={handleChange} />
          <Input label="Project Title" name="projectTitle" value={form.projectTitle} onChange={handleChange} />
        </div>
        <Input label="Description" name="description" value={form.description} onChange={handleChange} />
        <Input label="Duration (e.g., Jan - Mar)" name="duration" value={form.duration} onChange={handleChange} />
        <Input label="Outcome" name="outcome" value={form.outcome} onChange={handleChange} />
        <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Submit Work Plan</button>
      </form>

      {/* ── Records ── */
      /*<div className="mt-10">
        <h3 className="text-lg font-semibold mb-2"></h3>
        {records.length === 0 ? (
          <p className="text-gray-500"></p>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {['Year', 'Employee', 'Position', 'Project', 'Duration', 'Outcome'].map((h) => (
                    <th key={h} className="px-3 py-2 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id} className="border-t">
                    <td className="px-3 py-2">{r.year}</td>
                    <td className="px-3 py-2">{r.employeeName}</td>
                    <td className="px-3 py-2">{r.position}</td>
                    <td className="px-3 py-2">{r.projectTitle}</td>
                    <td className="px-3 py-2">{r.duration}</td>
                    <td className="px-3 py-2">{r.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Input({ label, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input
        {...props}
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-indigo-200"
        required
      />
    </label>
  );
}*/

'use client';

import { useState } from 'react';
//import API from '../../API/axios';
import API from '@/API/axios';

export default function ProgrammeForm() {
  const [form, setForm] = useState({
    employeeName: '',
    position: '',
    projectTitle: '',
    description: '',
    date: '',
    duration: '',
    outcome: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/programmes', form);
    alert('Programme submitted!');
    setForm({
      employeeName: '',
      position: '',
      projectTitle: '',
      description: '',
      date: '',
      duration: '',
      outcome: '',
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow rounded-xl">
      <h2 className="text-xl font-bold mb-6">Submit Programme</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['employeeName', 'position', 'projectTitle', 'description', 'date', 'duration', 'outcome'].map((field) => (
          <div key={field}>
            <label className="block font-medium">{field.replace(/([A-Z])/g, ' $1')}</label>
            <input
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
}

