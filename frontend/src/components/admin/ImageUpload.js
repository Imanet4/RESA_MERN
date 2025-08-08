import React from 'react';

const ImageUpload = ({ onImageChange, previews, required }) => {
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    onImageChange(files, previews);
  };

  return (
    <div className="mb-3">
      <label className="form-label">Room Images</label>
      <input
        type="file"
        className="form-control"
        multiple
        onChange={handleImageChange}
        required={required}
      />
      <div className="image-preview mt-2">
        {previews.map((preview, index) => (
          <img 
            key={index} 
            src={preview} 
            alt={`Preview ${index}`}
            className="img-thumbnail m-1"
            style={{ height: '100px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;