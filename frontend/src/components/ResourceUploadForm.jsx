import { useState } from 'react';

const ResourceUploadForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        tags: '',
        file: null,
    });
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const validationErrors = {};

        if (!formData.title.trim()) {
            validationErrors.title = 'Title is required.';
        }

        if (!formData.category) {
            validationErrors.category = 'Category is required.';
        }

        if (!formData.file) {
            validationErrors.file = 'Please select a file.';
        } else {
            const maximumSize = 10 * 1024 * 1024;
            const allowedTypes = [
                'application/pdf',
                'image/jpeg',
                'image/png',
                'text/plain',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            ];

            if (formData.file.size > maximumSize) {
                validationErrors.file = 'The file must be 10 MB or smaller.';
            } else if (!allowedTypes.includes(formData.file.type)) {
                validationErrors.file = 'This file type is not supported.';
            }
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleChange = (event) => {
        const { name, value, files } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }
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
            {errors.title && (
                <p className="text-red-600 text-sm mb-4">
                    {errors.title}
                </p>
            )}

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
            {errors.category && (
                <p className="text-red-600 text-sm mb-4">
                    {errors.category}
                </p>
            )}

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
                accept='.pdf, .jpg, .jpeg, .png, .txt, .doc, .docx, .ppt, .pptx'
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
            />
            {errors.file && (
                <p className="text-red-600 text-sm mb-4">
                    {errors.file}
                </p>
            )}

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