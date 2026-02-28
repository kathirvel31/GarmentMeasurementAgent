import React, { useState, useCallback } from 'react';
import { Upload, FileImage, Loader2 } from 'lucide-react';

const ImageUpload = ({ onUploadStart, onUploadSuccess, onUploadError }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleFile = useCallback(async (file) => {
        if (!file || !file.type.startsWith('image/')) {
            onUploadError('Please select a valid image file.');
            return;
        }

        setLoading(true);
        onUploadStart();

        try {
            await onUploadSuccess(file);
        } catch (err) {
            onUploadError(err.message || 'Error processing image');
        } finally {
            setLoading(false);
        }
    }, [onUploadStart, onUploadSuccess, onUploadError]);

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    return (
        <div
            className={`upload-zone position-relative border border-2 border-dashed rounded-5 p-5 d-flex flex-column align-items-center justify-content-center cursor-pointer transition-all duration-300
        ${isDragging ? 'dragging shadow-lg' : 'hover-bg-light border-slate-200'}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => document.getElementById('fileInput').click()}
        >
            <input
                id="fileInput"
                type="file"
                className="d-none"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files[0])}
            />

            {loading ? (
                <div className="d-flex flex-column align-items-center gap-4">
                    <div className="position-relative">
                        <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem', borderWidth: '0.25rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <Loader2 className="position-absolute top-50 start-50 translate-middle text-primary opacity-50 animate-pulse" size={32} />
                    </div>
                    <div className="text-center">
                        <p className="h4 font-weight-bold text-dark mb-1">Processing Spec...</p>
                        <p className="text-muted small font-weight-medium">Our AI is analyzing points and scale</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="icon-box bg-light text-muted p-4 rounded-4 mb-4 transition-all duration-300">
                        <Upload size={36} className="upload-icon" />
                    </div>
                    <h3 className="h3 font-weight-bold text-dark mb-3">Click to upload</h3>
                    <p className="text-muted text-center small font-weight-medium mb-0">
                        or drag and drop your garment image here.
                    </p>
                    <Badge bg="light" text="dark" className="mt-4 border rounded-pill px-3 py-2 font-weight-bold text-uppercase tracking-widest" style={{ fontSize: '10px' }}>
                        ArUco Marker Recommended
                    </Badge>

                    <div className="mt-5 d-flex align-items-center gap-3 text-muted opacity-25" style={{ fontSize: '10px' }}>
                        <div className="flex-grow-1 border-bottom" style={{ width: '30px' }} />
                        <span className="font-weight-bold text-uppercase tracking-widest">High Fidelity Required</span>
                        <div className="flex-grow-1 border-bottom" style={{ width: '30px' }} />
                    </div>
                </>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .upload-zone { background-color: transparent; min-height: 400px; }
                .upload-zone.dragging { border-color: #2563eb !important; background-color: rgba(37, 99, 235, 0.05) !important; transform: scale(0.99); }
                .upload-zone:hover { border-color: #2563eb !important; }
                .hover-bg-light:hover { background-color: #f8fafc; }
                .icon-box { border: 8px solid #f1f5f9; }
                .upload-zone:hover .icon-box { background-color: #2563eb !important; color: white !important; border-color: #dbeafe !important; }
                .upload-zone:hover .upload-icon { transform: translateY(-3px); }
                .cursor-pointer { cursor: pointer; }
                .duration-300 { transition: all 0.3s ease; }
                .font-weight-bold { font-weight: 700 !important; }
                .font-weight-medium { font-weight: 500 !important; }
                .tracking-widest { letter-spacing: 0.1em; }
                .rounded-4 { border-radius: 1rem !important; }
                .rounded-5 { border-radius: 2rem !important; }
            `}} />
        </div>
    );
};

// Simplified Badge component placeholder since I'm using raw HTML or I can import it
import { Badge } from 'react-bootstrap';

export default ImageUpload;
