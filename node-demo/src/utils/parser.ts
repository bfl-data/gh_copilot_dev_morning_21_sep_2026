// Parse an ISO-8601 date string and return a Date object.
// Return null if invalid. Do not throw.
export function parseDate(dateString: string): Date | null {
    const timestamp = Date.parse(dateString);
    if (isNaN(timestamp)) {
        return null;
    }
    return new Date(timestamp);
}

