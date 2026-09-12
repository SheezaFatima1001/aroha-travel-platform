// POST /api/upload  (protected) - single image upload, field name "image"
export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided' });
  }
  // Served statically from /uploads - see server.js
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ success: true, data: { url } });
};