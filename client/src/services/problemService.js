
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const problemService = {
    async getAllProblems() {
        const response = await fetch(`${API_BASE_URL}/problems`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        });
        return response.json();
    },

    async getProblemById(id) {
        const response = await fetch(`${API_BASE_URL}/problems/id/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    async getProblemByTitle(title) {
        const response = await fetch(`${API_BASE_URL}/problems/${title}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },
    async getProblemsByDifficulty(difficulty) {
        const response = await fetch(`${API_BASE_URL}/problems/difficulty/${difficulty}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },
    async getProblemsByCategory(category) {
        const response = await fetch(`${API_BASE_URL}/problems/category/${category}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },
}

