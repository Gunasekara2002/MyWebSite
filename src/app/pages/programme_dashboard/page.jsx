'use client';

import { useEffect, useState } from 'react';
//import API from '../../API/axios';
import API from '@/API/axios';

export default function ViewProgrammes() {
  const [programmes, setProgrammes] = useState([]);

  useEffect(() => {
    API.get('/programmes')
      .then((res) => setProgrammes(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Submitted Programmes</h2>
      {programmes.length === 0 ? (
        <p>No programmes found.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2">Employee</th>
              <th className="px-3 py-2">Position</th>
              <th className="px-3 py-2">Project</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Duration</th>
              <th className="px-3 py-2">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {programmes.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="px-3 py-2">{p.employeeName}</td>
                <td className="px-3 py-2">{p.position}</td>
                <td className="px-3 py-2">{p.projectTitle}</td>
                <td className="px-3 py-2">{p.date}</td>
                <td className="px-3 py-2">{p.duration}</td>
                <td className="px-3 py-2">{p.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
