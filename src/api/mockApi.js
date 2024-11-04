const jsonApi = {
    "movieId": "m12345",
    "title": "The Great Adventure",
    "description": "An epic journey through uncharted lands.",
    "releaseYear": 2023,
    "rating": "PG-13",
    "qualities": [
        {
            "quality": "360p", "url": "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"
        },
        {
            "quality": "720p", "url": "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4"
        },
        {
            "quality": "1080p", "url":
                "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4"
        }
    ],
    "cast": [
        { "name": "John Doe", "role": "Explorer" },
        { "name": "Jane Smith", "role": "Navigator" }
    ]
}


export const getMockMovieData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(jsonApi);
        }, 500); 
    });
};

const mockUser = {
    username: "admin",
    password: "admin"
};

const validToken = "secureAuthToken123";

// Mock API for user login
export const login = (username, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Check if provided credentials match the mock user
            if (username === mockUser.username && password === mockUser.password) {
                resolve({ token: validToken });
            } else {
                reject(new Error("Unauthorized: Invalid username or password"));
            }
        }, 500);
    });
};

export const getMockMovieDataAuthentic = (token) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Check if the provided token matches the valid token
            if (token === validToken) {
                resolve(jsonApi);
            } else {
                reject(new Error("Unauthorized: Invalid token"));
            }
        }, 500);
    });
};