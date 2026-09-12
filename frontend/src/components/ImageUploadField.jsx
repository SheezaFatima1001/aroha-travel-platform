import { useState } from 'react';
import api from '../services/api.js';
import SafeImage from './SafeImage.jsx';

export default function ImageUploadField({ value, onChange, label = 'Image' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
      onChange(`${apiBase}${data.data.url}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Try a smaller image (max 5MB).');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="font-body text-xs text-stone/60 block mb-1">{label}</label>
      {value && (
        <div className="w-32 h-24 rounded-lg overflow-hidden mb-2 border border-stone/15">
          <SafeImage src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFile}
        disabled={uploading}
        className="block w-full text-xs font-body text-stone/60 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-amber file:text-dusk file:text-xs file:font-semibold file:cursor-pointer disabled:opacity-50"
      />
      {uploading && <p className="font-mono text-[10px] text-stone/40 mt-1">Uploading&hellip;</p>}
      {error && <p className="font-body text-xs text-clay mt-1">{error}</p>}
      <p className="font-mono text-[10px] text-stone/30 mt-1">Or paste an image URL directly:</p>
      <input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://&hellip;"
        className="w-full mt-1 bg-dusk border border-stone/15 rounded-lg px-3 py-1.5 font-body text-xs text-stone placeholder:text-stone/30 focus:border-amber outline-none"
      />
    </div>
  );
}