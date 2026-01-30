
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { QRCodeSVG } from 'qrcode.react';
import { Camera, RefreshCw, Smartphone, Upload, CheckCircle, Download } from 'lucide-react';
import { getPrompts, DEFAULT_PROMPTS } from './PromptManager';
import { uploadImage } from '../Settings/uploadManager';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

const PromptCard = ({ prompt, selected, onClick }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onClick(prompt)}
        className={`relative cursor-pointer rounded-xl overflow-hidden aspect-[4/5] border-4 transition-all ${selected ? 'border-[#f97316] shadow-[0_0_20px_rgba(249,115,22,0.6)]' : 'border-black opacity-80 hover:opacity-100'} `}
    >
        {prompt.sampleImage ? (
            <img src={prompt.sampleImage} alt={prompt.name} className="w-full h-full object-cover" />
        ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-center p-4">
                <span className="font-black text-black/40 uppercase">{prompt.name}</span>
            </div>
        )}
        <div className="absolute bottom-0 left-0 w-full bg-black/80 p-2">
            <h3 className="text-white text-xs font-black uppercase tracking-tighter truncate">{prompt.name}</h3>
        </div>
        {selected && (
            <div className="absolute top-2 right-2 bg-[#f97316] text-white rounded-full p-1">
                <CheckCircle size={16} />
            </div>
        )}
    </motion.div>
);

const PhotoBooth = () => {
    const [step, setStep] = useState('select'); // select, capture, processing, result
    const [prompts, setPrompts] = useState(DEFAULT_PROMPTS);
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [finalImageURL, setFinalImageURL] = useState(null); // URL for QR Code
    const [countdown, setCountdown] = useState(null);
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);
    const resultRef = useRef(null);

    useEffect(() => {
        const fetchPrompts = async () => {
            console.log("Fetching prompts...");
            const data = await getPrompts();
            console.log("Fetched prompts:", data);
            if (data && data.length > 0) {
                setPrompts(data);
            }
        };
        fetchPrompts();
    }, []);

    const processImage = async (imageSrc) => {
        setImgSrc(imageSrc);
        setStep('processing');

        try {
            // Attempt Real AI Generation first
            let generatedImageBlob = null;
            let usedRealAI = false;

            try {
                // Get the prompt text from the selected style
                let promptText = selectedPrompt?.description || "High quality portrait";
                try {
                    const parsed = JSON.parse(selectedPrompt?.prompt);
                    // Construct a rich prompt from the JSON fields if available
                    if (parsed.subject_role) {
                        promptText = `${parsed.subject_role}, ${parsed.setting}, ${parsed.outfit?.style}. ${parsed.atmosphere?.mood}. Photorealistic 8k.`;
                    }
                } catch (e) {
                    promptText = selectedPrompt?.prompt || promptText;
                }

                console.log("Attempting Real AI with prompt:", promptText);

                // Call our secure backend API
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image: imageSrc,
                        prompt: promptText
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.image) {
                        const res = await fetch(data.image);
                        generatedImageBlob = await res.blob();
                        usedRealAI = true;
                        console.log("Real AI Generation Successful!");
                    }
                } else {
                    console.warn("Real AI API unavailable (likely no key), falling back to simulation.");
                }

            } catch (aiError) {
                console.warn("Real AI failed, falling back:", aiError);
            }

            let file;
            if (usedRealAI && generatedImageBlob) {
                file = new File([generatedImageBlob], `ai_generated_${Date.now()}.jpg`, { type: "image/jpeg" });
            } else {
                // FALLBACK: Canvas Composition (Simulation)
                // 1. Load Base Image (Webcam)
                const baseImg = new Image();
                baseImg.src = imageSrc;
                await new Promise(r => baseImg.onload = r);

                // 2. Prepare Canvas
                const canvas = document.createElement('canvas');
                canvas.width = baseImg.width;
                canvas.height = baseImg.height;
                const ctx = canvas.getContext('2d');

                // 3. Draw Base Image
                ctx.drawImage(baseImg, 0, 0);

                // 4. Draw Style Overlay (if exists)
                if (selectedPrompt?.sampleImage) {
                    try {
                        const overlayImg = new Image();
                        overlayImg.crossOrigin = "anonymous";
                        overlayImg.src = selectedPrompt.sampleImage;

                        await new Promise((resolve, reject) => {
                            overlayImg.onload = resolve;
                            overlayImg.onerror = reject;
                        });

                        // Draw overlay with simulated blending
                        ctx.globalCompositeOperation = 'screen';
                        ctx.globalAlpha = 0.5; // Adjustable opacity
                        ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);

                        // Reset context
                        ctx.globalCompositeOperation = 'source-over';
                        ctx.globalAlpha = 1.0;

                        // Add atmospheric glow
                        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
                        gradient.addColorStop(0, 'rgba(249, 115, 22, 0.3)');
                        gradient.addColorStop(1, 'rgba(0,0,0,0)');
                        ctx.fillStyle = gradient;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);

                    } catch (overlayError) {
                        console.warn("Could not load overlay for baking:", overlayError);
                        // Continue without overlay if it fails (e.g. CORS)
                    }
                }

                // 5. Convert to Blob for upload
                let blob;
                try {
                    blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
                } catch (canvasError) {
                    console.warn("Canvas tainted, falling back to raw image:", canvasError);
                    const res = await fetch(imageSrc);
                    blob = await res.blob();
                }
                file = new File([blob], `capture_${Date.now()}.jpg`, { type: "image/jpeg" });
            }

            // Upload
            try {
                const url = await uploadImage(file, 'generated_photos');
                setFinalImageURL(url);

                // If Real AI was used, we update the display source too so the user sees the new AI image immediately
                if (usedRealAI) {
                    setImgSrc(URL.createObjectURL(file));
                }
            } catch (uploadError) {
                console.error("Upload failed (expected if rules deny public writes):", uploadError);
            }

            // Artificial delay (shorten if real AI already took time?)
            // Real AI takes time, so we might not need extra delay, but let's keep it consistent.
            setTimeout(() => setStep('result'), 2000);
        } catch (error) {
            console.error("Error processing image:", error);
            alert("Failed to process image. Please try again.");
            setStep('select');
        }
    };

    const handleCapture = useCallback(() => {
        setCountdown(3);
        let count = 3;
        const timer = setInterval(() => {
            count -= 1;
            setCountdown(count);
            if (count === 0) {
                clearInterval(timer);
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc) {
                    processImage(imageSrc);
                } else {
                    alert("Camera capture failed. Please ensure camera permissions are allowed.");
                    setCountdown(null);
                }
            }
        }, 1000);
    }, [webcamRef]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                processImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDownload = async () => {
        if (resultRef.current) {
            try {
                const canvas = await html2canvas(resultRef.current, { useCORS: true, scale: 2 });
                const link = document.createElement('a');
                link.download = `FTC_Artifact_${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (err) {
                console.error("Download failed:", err);
                // Fallback to direct image download if canvas fails
                if (finalImageURL) {
                    const link = document.createElement('a');
                    link.href = finalImageURL;
                    link.download = 'FTC_Capture.jpg';
                    link.target = '_blank';
                    link.click();
                }
            }
        }
    };

    const resetGame = () => {
        setStep('select');
        setSelectedPrompt(null);
        setImgSrc(null);
        setFinalImageURL(null);
        setCountdown(null);
    };

    return (
        <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-4">
            {/* Header */}
            <div className="w-full max-w-6xl flex justify-between items-center mb-8 border-b-2 border-white/20 pb-4">
                <h1 className="text-2xl font-black uppercase tracking-tighter italic text-[#f97316]">
                    FTC Photobooth <span className="text-white not-italic text-sm ml-2 font-normal">AI Powered v1.2</span>
                </h1>
                <div className="flex gap-2">
                    {['select', 'capture', 'result'].map((s, i) => (
                        <div key={s} className={`h-2 w-8 rounded-full ${step === s || (step === 'processing' && s === 'result') ? 'bg-[#f97316]' : 'bg-white/20'} `} />
                    ))}
                </div>
            </div>

            <div className="w-full max-w-6xl relative min-h-[600px] flex flex-col items-center justify-center">

                {/* STEP 1: SELECT STYLE */}
                {step === 'select' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                        <h2 className="text-4xl font-black text-center mb-12 uppercase tracking-tighter">Choose Your Character</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {prompts.length === 0 ? (
                                <div className="col-span-full text-center py-12 text-white/50">
                                    <p>Loading styles...</p>
                                    <p className="text-xs mt-2 text-red-500">If this persists, please refresh.</p>
                                </div>
                            ) : (
                                prompts.map(prompt => (
                                    <PromptCard
                                        key={prompt.id}
                                        prompt={prompt}
                                        selected={selectedPrompt?.id === prompt.id}
                                        onClick={setSelectedPrompt}
                                    />
                                ))
                            )}
                        </div>
                        <div className="flex justify-center mt-12">
                            <button
                                disabled={!selectedPrompt}
                                onClick={() => setStep('capture')}
                                className="bg-[#f97316] text-white px-12 py-4 text-xl font-black uppercase tracking-tighter hover:bg-white hover:text-[#f97316] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_white]"
                            >
                                Next Step &gt;
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: CAPTURE */}
                {step === 'capture' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full max-w-4xl flex items-center justify-center bg-black/50 border-4 border-white/20 rounded-xl overflow-hidden min-h-[400px]">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{
                                width: 1280,
                                height: 720,
                                facingMode: "user"
                            }}
                            className="w-full h-auto max-h-[70vh] object-contain"
                            mirrored={true}
                        />

                        {/* Countdown Overlay */}
                        <AnimatePresence>
                            {countdown > 0 && (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1.5, opacity: 1 }}
                                    exit={{ scale: 2, opacity: 0 }}
                                    key={countdown}
                                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
                                >
                                    <span className="text-[200px] font-black text-white drop-shadow-[0_0_20px_rgba(249,115,22,1)]">{countdown}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Capture Controls (Right Side) */}
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-40">
                            <button
                                onClick={handleCapture}
                                disabled={countdown > 0}
                                className="w-20 h-20 rounded-full border-4 border-white bg-white/20 hover:bg-[#f97316] transition-all flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Camera size={40} />
                            </button>

                            <div className="bg-black/80 p-2 rounded-lg text-center cursor-pointer hover:bg-white/20 transition-all border border-white/20" onClick={() => fileInputRef.current.click()}>
                                <Upload size={24} className="mx-auto mb-1" />
                                <span className="text-[10px] uppercase font-bold">Upload</span>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                            </div>
                        </div>

                        <button onClick={() => setStep('select')} className="absolute top-4 left-4 text-white/50 hover:text-white flex items-center gap-2 z-40 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                            &lt; Back
                        </button>
                    </motion.div>
                )}

                {/* STEP 3: PROCESSING */}
                {step === 'processing' && (
                    <div className="text-center space-y-4">
                        <div className="w-24 h-24 border-8 border-white/10 border-t-[#f97316] rounded-full animate-spin mx-auto"></div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter animate-pulse">Generating Artifact...</h2>
                        <p className="text-white/50 font-mono text-sm max-w-md mx-auto">
                            Applying style: <br />
                            <span className="text-[#f97316]">{selectedPrompt?.name}</span>
                        </p>
                    </div>
                )}

                {/* STEP 4: RESULT */}
                {step === 'result' && imgSrc && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-8 items-center bg-white text-black p-4 md:p-8 rounded-xl max-w-5xl">
                        {/* Final Image Container - Ref for html2canvas */}
                        <div ref={resultRef} className="relative w-full max-w-md aspect-[4/5] bg-black overflow-hidden border-8 border-black shadow-2xl">
                            {/* Base Image (Captured) */}
                            <img
                                src={imgSrc}
                                alt="Result"
                                className="w-full h-full object-cover mix-blend-overlay opacity-80"
                            />

                            {/* Overlay Effect based on prompt (Simulation) */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#f97316]/40 to-transparent mix-blend-color-dodge pointer-events-none"></div>

                            {/* User uploaded prompt Image overlay if available (Simulation of style transfer) */}
                            {selectedPrompt?.sampleImage && (
                                <img
                                    src={selectedPrompt.sampleImage}
                                    className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen pointer-events-none"
                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                />
                            )}

                            {/* QR Overlay */}
                            {finalImageURL && (
                                <div className="absolute top-4 right-4 bg-white p-2 border-2 border-black z-10">
                                    <QRCodeSVG value={finalImageURL} size={64} />
                                </div>
                            )}

                            <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
                                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter drop-shadow-[4px_4px_0px_black]">{selectedPrompt?.name}</h2>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col gap-6 text-center md:text-left">
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-2">Discovery Complete!</h3>
                                <p className="font-mono text-sm text-black/60">Scan the QR code to view the original capture, or download the full artifact below.</p>
                            </div>

                            <div className="space-y-4">
                                <button onClick={handleDownload} className="w-full bg-black text-white p-4 font-black uppercase hover:bg-[#f97316] transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-x-1 active:translate-y-1 active:shadow-none">
                                    <Download size={20} /> Download Artifact
                                </button>
                                <button onClick={resetGame} className="w-full border-4 border-black text-black p-4 font-black uppercase hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 active:translate-x-1 active:translate-y-1">
                                    <RefreshCw size={20} /> Create New
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
};

export default PhotoBooth;
