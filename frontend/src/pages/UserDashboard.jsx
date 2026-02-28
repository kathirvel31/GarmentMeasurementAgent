import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav, Alert, Badge } from 'react-bootstrap';
import { RefreshCw, Github, Sparkles, AlertCircle, User as UserIcon } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import MeasurementResults from '../components/MeasurementResults';
import { garmentService } from '../services/api';

const UserDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
   

    const handleUploadStart = () => {
        setLoading(true);
        setResult(null);
        setError(null);
    };

    const handleUploadSuccess = async (file) => {
        try {
            const data = await garmentService.processImage(file);
            if (data.success) {
                setResult(data);
            } else {
                setError(data.error || 'The system could not process this image.');
            }
        } catch (err) {
            setError(err.message || 'The server encountered an error while processing the image.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setError(null);
        setLoading(false);
    };

    return (
        <div className="min-vh-100 bg-white d-flex flex-column">
            <div className="container-fluid px-4 px-md-5 py-4 py-md-5 flex-grow-1">

                {/* Header */}
                <header className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-4 mb-5 border-bottom pb-4">
                    <div className="space-y-3">
                        <Badge bg="light" text="primary" className="border px-3 py-2 rounded-pill font-weight-bold text-uppercase tracking-widest" style={{ fontSize: '10px' }}>
                            <Sparkles size={12} className="me-2" />
                            Garment Measurement Agent v1.0
                        </Badge>
                        <h1 className="h1 font-weight-bold text-dark tracking-tight mb-0">
                           AI-Powered Garment Measurement <span className="text-primary text-uppercase">Agent</span>
                        </h1>
                    
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        <Button
                            variant="white"
                            onClick={handleReset}
                            className="border rounded-4 p-3 d-flex align-items-center gap-2 font-weight-bold shadow-sm"
                            title="New Analysis">
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                            <span className="d-none d-sm-inline text-uppercase tracking-widest" style={{ fontSize: '10px' }}>Reset</span>
                        </Button>
                    </div>
                </header>

                {/* Main Content */}
                <main>
                    {error && (
                        <Alert variant="danger" className="border-0 rounded-4 d-flex align-items-center gap-3 py-4 px-4 small font-weight-bold mb-5 shadow-sm">
                            <AlertCircle size={20} />
                            {error}
                        </Alert>
                    )}

                    {!result ? (
                        <div className="w-100">
                            <Card className="border-0 shadow-lg rounded-5 p-4 p-md-5 mb-5 overflow-hidden">
                                <ImageUpload
                                    onUploadStart={handleUploadStart}
                                    onUploadSuccess={handleUploadSuccess}
                                    onUploadError={(msg) => setError(msg)}
                                />
                            </Card>

                            <Row className="g-4">
                                {[
                                    { title: "Precision Mapping", desc: "Object localization using industrial YOLOv11 models tuned for accuracy." },
                                    { title: "Segment Analysis", desc: "High-fidelity isolation and garment segmentation for reliable context." },
                                    { title: "Industrial Calibration", desc: "Automated scaling via ArUco standards to deliver compliant metrics." }
                                ].map((feature, i) => (
                                    <Col md={4} key={i}>
                                        <Card className="h-100 border-light shadow-sm rounded-4 p-4 hover-lift duration-300">
                                            <div className="bg-light rounded-3 d-flex align-items-center justify-content-center mb-4" style={{ width: '48px', height: '48px' }}>
                                                <div className="border-bottom border-end border-2 border-secondary opacity-25" style={{ width: '20px', height: '20px' }} />
                                            </div>
                                            <h4 className="h5 font-weight-bold text-dark mb-3 tracking-tight">{feature.title}</h4>
                                            <p className="small text-muted font-weight-medium mb-0">{feature.desc}</p>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    ) : (
                        <MeasurementResults data={result} />
                    )}
                </main>

                <footer className="mt-5 pt-5 border-top d-flex flex-column flex-md-row justify-content-between align-items-center gap-4 text-muted small font-weight-bold text-uppercase tracking-widest mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '32px', height: '32px' }}>
                            <span className="small font-weight-bold">G</span>
                        </div>
                        <p className="mb-0">GARMENT MEASUREMENT AGENT // v1.0</p>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                        <Nav.Link href="#" className="p-0 d-flex align-items-center gap-2">
                            <Github size={18} />
                            <span>Docs</span>
                        </Nav.Link>
                    </div>
                </footer>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .font-weight-bold { font-weight: 700 !important; }
        .font-weight-medium { font-weight: 500 !important; }
        .tracking-tight { letter-spacing: -0.025em; }
        .tracking-widest { letter-spacing: 0.1em; }
        .rounded-4 { border-radius: 1rem !important; }
        .rounded-5 { border-radius: 2rem !important; }
        .hover-lift:hover { transform: translateY(-4px); }
        .duration-300 { transition: all 0.3s ease; }
        .btn-white { background-color: #fff; border-color: #f1f5f9; }
        .btn-white:hover { background-color: #f8fafc; }
      `}} />
        </div>
    );
};

export default UserDashboard;
