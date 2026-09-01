import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ResourceLinkList = ({ resources, setResources, setEditingResource }) => {
  const { user } = useAuth();

  const handleDelete = async (resourceId) => {
    if (!window.confirm('Delete this resource link?')) return;
    try {
      await axiosInstance.delete(`/api/resources/${resourceId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setResources(resources.filter((resource) => resource._id !== resourceId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete resource.');
    }
  };

  if (!resources.length) {
    return <p className="text-center text-gray-500">No resource links yet. Add your first one above.</p>;
  }

  return (
    <div>
      {resources.map((resource) => (
        <article key={resource._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <div className="flex justify-between gap-4">
            <div>
              <h2 className="font-bold text-lg">{resource.title}</h2>
              <p className="text-sm text-blue-700">{resource.category}</p>
            </div>
            <a href={resource.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">Open Resource</a>
          </div>
          {resource.description && <p className="my-2">{resource.description}</p>}
          {!!resource.tags?.length && <p className="text-sm text-gray-600">Tags: {resource.tags.join(', ')}</p>}
          <div className="mt-3">
            <button onClick={() => setEditingResource(resource)} className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
            <button onClick={() => handleDelete(resource._id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ResourceLinkList;
