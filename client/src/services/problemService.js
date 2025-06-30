
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const problemService = {
    async getAllProblems() {
        const response = await fetch(`${BACKEND_URL}/problems`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        });
        return response.json();
    },

    async getProblemById(id) {
        const response = await fetch(`${BACKEND_URL}/problems/id/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },

    async getProblemByTitle(title) {
        const response = await fetch(`${BACKEND_URL}/problems/${title}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },
    async getProblemsByDifficulty(difficulty) {
        const response = await fetch(`${BACKEND_URL}/problems/difficulty/${difficulty}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },
    async getProblemsByCategory(category) {
        const response = await fetch(`${BACKEND_URL}/problems/category/${category}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },
}

