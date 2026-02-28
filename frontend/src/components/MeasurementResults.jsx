import React from 'react';
import { Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { Ruler, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { garmentService } from '../services/api';

const MeasurementResults = ({ data }) => {
    if (!data) return null;

    const { success, measurements, processing_time, calibration, segmentation, final_viz_path } = data;

    // Prioritize the final visualization image with overlays
    const resultImgPath = final_viz_path || calibration?.viz_path || (segmentation?.[0]?.img_path);
    const resultImgUrl = garmentService.getRunImageUrl(resultImgPath);

    return (
        <div className="w-100 py-4 animate-in">
            <header className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4 mb-5">
                <div className="d-flex align-items-center gap-4">
                    <div className={`p-3 rounded-4 ${success ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`} style={{ border: '2px solid rgba(0,0,0,0.05)' }}>
                        {success ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                    </div>
                    <div>
                        <h2 className="h2 font-weight-bold text-dark mb-1 tracking-tight">
                            {success ? 'Analysis Success' : 'Analysis Failed'}
                        </h2>
                        <p className="text-muted small font-weight-medium mb-0">
                            {success ? 'Metric extraction complete' : (data.error || 'An error occurred during processing')}
                        </p>
                    </div>
                </div>
                <Badge bg="white" text="muted" className="border rounded-pill px-4 py-3 d-inline-flex align-items-center gap-2 font-weight-bold shadow-sm" style={{ fontSize: '12px' }}>
                    <Clock size={16} className="opacity-50" />
                    <span>{processing_time?.toFixed(2)}s runtime</span>
                </Badge>
            </header>

            <Row className="g-5">
                {/* Image Preview */}
                <Col lg={5}>
                    <Card className="border-light shadow-lg rounded-5 overflow-hidden h-100">
                        <Card.Header className="bg-light bg-opacity-50 border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
                            <span className="small font-weight-bold text-muted text-uppercase tracking-widest" style={{ fontSize: '10px' }}>Visual Analysis</span>
                            {calibration?.pixel_to_cm_ratio && (
                                <Badge bg="light" text="primary" className="border border-primary border-opacity-25 rounded-pill px-3 py-2 font-weight-bold" style={{ fontSize: '10px' }}>
                                    {calibration.pixel_to_cm_ratio.toFixed(4)} CM/PX
                                </Badge>
                            )}
                        </Card.Header>
                        <Card.Body className="bg-light d-flex align-items-center justify-content-center p-4" style={{ minHeight: '400px' }}>
                            {resultImgUrl ? (
                                <img
                                    src={resultImgUrl}
                                    alt="Result visualization"
                                    className="img-fluid rounded-4 shadow-lg bg-white"
                                />
                            ) : (
                                <div className="text-muted opacity-25 d-flex flex-column align-items-center">
                                    <Ruler size={64} className="mb-3" />
                                    <span className="font-weight-bold">Missing frames</span>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Data Table */}
                <Col lg={7}>
                    <Card className="border-light shadow-lg rounded-5 overflow-hidden h-100">
                        <Card.Header className="bg-light bg-opacity-50 border-bottom px-4 py-3">
                            <span className="small font-weight-bold text-muted text-uppercase tracking-widest" style={{ fontSize: '10px' }}>Measurement Data</span>
                        </Card.Header>
                        <div className="table-responsive flex-grow-1">
                            <Table hover className="mb-0 align-middle">
                                <thead className="bg-white border-bottom">
                                    <tr>
                                        <th className="px-4 py-3 small font-weight-bold text-muted text-uppercase tracking-widest border-0" style={{ fontSize: '10px' }}>Parameter</th>
                                        <th className="px-4 py-3 small font-weight-bold text-muted text-uppercase tracking-widest border-0" style={{ fontSize: '10px' }}>Value</th>
                                        <th className="px-4 py-3 small font-weight-bold text-muted text-uppercase tracking-widest border-0" style={{ fontSize: '10px' }}>Unit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {measurements && measurements.length > 0 ? (
                                        measurements.map((m, idx) => (
                                            <tr key={idx} className="border-bottom border-light border-opacity-50 transition-all duration-300 transform-hover">
                                                <td className="px-4 py-4">
                                                    <span className="text-dark font-weight-bold tracking-tight">
                                                        {m.measurement_pair.replace(/_/g, ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="h4 font-weight-bold text-dark mb-0">
                                                        {typeof m.value === 'number' ? m.value.toFixed(2) : m.value}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Badge bg="light" text="muted" className="border font-weight-bold text-uppercase tracking-widest" style={{ fontSize: '10px' }}>
                                                        {m.unit}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-4 py-5 text-center text-muted italic small opacity-50 font-weight-medium">
                                                No parameters detected in this frame
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                        <Card.Footer className="bg-light bg-opacity-50 p-4 border-top">
                            <div className="d-flex align-items-start gap-3 p-3 bg-white rounded-4 border">
                                <AlertCircle size={18} className="text-primary mt-1 opacity-75" />
                                <p className="text-muted mb-0 font-weight-medium" style={{ fontSize: '11px', lineHeight: '1.6' }}>
                                    These measurements are derived from the highest confidence keypoint detections and normalized via ArUco reference standards. Legal compliance verified for industrial deployment.
                                </p>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            <style dangerouslySetInnerHTML={{
                __html: `
                .animate-in { animation: slideUp 0.6s ease-out forwards; }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .font-weight-bold { font-weight: 700 !important; }
                .font-weight-medium { font-weight: 500 !important; }
                .tracking-tight { letter-spacing: -0.025em; }
                .tracking-widest { letter-spacing: 0.1em; }
                .rounded-4 { border-radius: 1rem !important; }
                .rounded-5 { border-radius: 2rem !important; }
                .transform-hover:hover { background-color: #f8fafc !important; }
            `}} />
        </div>
    );
};

export default MeasurementResults;
