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

            <label className="block mb-2" htmlFor="resource-title">
                Title
            </label>
            <input
                id="resource-title"
                type="text"
                name="title"
                placeholder="Resource title"
                value={formData.title}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
            />

            <label className="block mb-2" htmlFor="resource-description">
                Description
            </label>
            <textarea
                id="resource-description"
                name="description"
                placeholder="Resource description"
                value={formData.description}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
                rows="4"
            />

            <label className="block mb-2" htmlFor="resource-category">
                Category
            </label>
            <select
                id="resource-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
            >
                <option value="">Select a category</option>
                <option value="document">Document</option>
                <option value="pdf">PDF</option>
                <option value="presentation">Presentation</option>
                <option value="video">Video Link</option>
                <option value="other">Other</option>
            </select>

            <label className="block mb-2" htmlFor="resource-tags">
                Tags
            </label>
            <input
                id="resource-tags"
                type="text"
                name="tags"
                placeholder="react, javascript, frontend"
                value={formData.tags}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
            />

            <label className="block mb-2" htmlFor="resource-file">
                File
            </label>
            <input
                id="resource-file"
                type="file"
                name="file"
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
            />

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