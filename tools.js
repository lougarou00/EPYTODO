function formatDate(isoDate) {
    if (!isoDate) return null;
    const date = new Date(isoDate);
    const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
    return formattedDate;
}

module.exports = formatDate;
