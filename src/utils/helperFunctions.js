// Function to calculate the time ago from a given date
export const timeAgo = (date) => {
    // Options for formatting the date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    // Get the current date and time
    const today = new Date();
    // Use the provided 'date' parameter instead of 'reviewDate'
    const timeDifference = today - new Date(date); // Changed 'reviewDate' to 'new Date(date)'

    // Determine the time difference and format the output accordingly
    if (timeDifference < 60000) {
        return 'just now';
    } else if (timeDifference < 3600000) {
        const minutes = Math.floor(timeDifference / 60000);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (timeDifference < 86400000) {
        const hours = Math.floor(timeDifference / 3600000);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
        // Use 'date' parameter to format the date
        return `on ${new Date(date).toLocaleDateString(undefined, options)}`; // Changed 'reviewDate' to 'new Date(date)'
    }
};

// Function to generate a random color based on an id
export const generateRandomColor = (id) => {
    const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const color = `hsl(${hash % 360}, 70%, 70%)`;
    return color;
};
