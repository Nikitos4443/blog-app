export function handler(error) {
    if (error.response) {
        throw new Error(error.response.data);
    } else if (error.request) {
        throw new Error(error.request.data);
    } else {
        throw new Error(error.message);
    }
}