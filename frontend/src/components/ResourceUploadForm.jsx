import { useState } from 'react';

const ResourceUploadForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    file: null,
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded mb-6"
    >
      <h1 className="text-2xl font-bold mb-4">Add Resource</h1>

      {/* LEAR-24 will add the fields here */}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Upload Resource
      </button>
    </form>
  );
};

export default ResourceUploadForm;