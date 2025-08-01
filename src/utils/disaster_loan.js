/*import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;*/

// At the top of your file (page.jsx or similar)
/*import axios from 'axios';

// You can also configure a custom Axios instance like this:
const api = axios.create({
  baseURL: 'http://localhost:5000', // Change to your backend URL or use relative path
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inside your component
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await api.post('/api/disaster_loans', formData); // 👈 corrected endpoint
    alert('Application submitted successfully!');
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Failed to submit application.');
  }
};

export default api;*/