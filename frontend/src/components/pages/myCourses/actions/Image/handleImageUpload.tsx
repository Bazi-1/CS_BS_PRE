export const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setSelectedFile: (file: File) => void
) => {
    if (event.target.files && event.target.files.length > 0) {
        setSelectedFile(event.target.files[0]); // Store the file object
    }
};
