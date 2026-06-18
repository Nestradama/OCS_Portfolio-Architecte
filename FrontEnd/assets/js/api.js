
const API_URL = "http://localhost:5678/api";

async function getWorks() {
    try {
        const response = await fetch(`${API_URL}/works`);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failure fetch works:", error);
        return [];
    }
}

async function getCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failure fetch categories:", error);
        return [];
    }
}

async function deleteWork(workId) {
    const token = window.localStorage.getItem("token");
    if (!token) {
        console.error("No token found for delete operation.");
        return false;
    }

    try {
        const response = await fetch(`${API_URL}/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.ok;
    } catch (error) {
        console.error("Error deleting work:", error);
        return false;
    }
}

async function addWork(formData) {
    const token = window.localStorage.getItem("token");
    if (!token) {
        console.error("No token found for add operation.");
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/works`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error("Failed to add work:", response.status);
            return null;
        }
    } catch (error) {
        console.error("Error adding work:", error);
        return null;
    }
}
