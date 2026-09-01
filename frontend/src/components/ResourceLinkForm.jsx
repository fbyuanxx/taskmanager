import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const emptyForm = { title: '', description: '', category: '', tags: '', url: '' };

const ResourceLinkForm = ({ resources, setResources, editingResource, setEditingResource }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    setFormData(editingResource ? {
      title: editingResource.title,
      description: editingResource.description || '',
      category: editingResource.category,
      tags: editingResource.tags?.join(', ') || '',
      url: editingResource.url,
    } : emptyForm);
  }, [editingResource]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const config = { headers: { Authorization: `Bearer ${user.token}` } };

    try {
      if (editingResource) {
        const response = await axiosInstance.put(`/api/resources/${editingResource._id}`, formData, config);
        setResources(resources.map((resource) => resource._id === response.data._id ? response.data : resource));
      } else {
        const response = await axiosInstance.post('/api/resources', formData, config);
        setResources([response.data, ...resources]);
      }
      setEditingResource(null);
      setFormData(emptyForm);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save resource.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingResource ? 'Edit Resource Link' : 'Add Resource Link'}</h1>
      <input name="title" required placeholder="Title" value={formData.title} onChange={handleChange} className="w-full mb-4 p-2 border rounded" />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full mb-4 p-2 border rounded" />
      <input name="category" required placeholder="Category (e.g. Web Development)" value={formData.category} onChange={handleChange} className="w-full mb-4 p-2 border rounded" />
      <input name="tags" placeholder="Tags, separated by commas" value={formData.tags} onChange={handleChange} className="w-full mb-4 p-2 border rounded" />
      <input name="url" type="url" required placeholder="https://example.com/resource" value={formData.url} onChange={handleChange} className="w-full mb-4 p-2 border rounded" />
      <div className="flex gap-2">
        <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded">
          {editingResource ? 'Update Resource' : 'Add Resource'}
        </button>
        {editingResource && (
          <button type="button" onClick={() => setEditingResource(null)} className="px-6 bg-gray-500 text-white rounded">Cancel</button>
        )}
      </div>
    </form>
  );
};

export default ResourceLinkForm;
