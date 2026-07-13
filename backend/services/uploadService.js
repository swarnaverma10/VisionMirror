export const processUpload = (file) => {
  if (!file) {
    const error = new Error('No file uploaded.');
    error.status = 400;
    throw error;
  }

  return {
    imageUrl: `/uploads/${file.filename}`,
    filename: file.filename
  };
};
