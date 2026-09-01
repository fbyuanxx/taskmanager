import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import ResourceLinkForm from '../components/ResourceLinkForm';
import ResourceLinkList from '../components/ResourceLinkList';

const Resources = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [editingResource, setEditingResource] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axiosInstance.get('/api/resources', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setResources(response.data);
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to fetch resources.');
      }
    };

    if (user?.token) fetchResources();
  }, [user]);

  return (
    <main className="container mx-auto p-6 max-w-3xl">
      <ResourceLinkForm resources={resources} setResources={setResources} editingResource={editingResource} setEditingResource={setEditingResource} />
      <ResourceLinkList resources={resources} setResources={setResources} setEditingResource={setEditingResource} />
    </main>
  );
};

export default Resources;
