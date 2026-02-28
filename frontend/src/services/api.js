import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const garmentService = {
    processImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/api/process', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Failed to process image');
        }
    },
    getRunImageUrl: (path) => {
        if (!path) return null;
        // Normalize all backslashes (Windows) to forward slashes
        const normalized = path.replace(/\\/g, '/');
        // Remove 'results/' or '/results/' prefix if it exists to avoid duplication
        // The backend mount point is /results, so we only want the sub-path
        const subPath = normalized.replace(/^\/?results\//, '');
        return `${API_BASE_URL}/results/${subPath}`;
    }
};
