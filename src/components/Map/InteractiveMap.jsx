import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import mapImage from '../../assets/map.png'; // Make sure path is correct relative to this file
import { mapAreas } from './mapData';
import clsx from 'clsx';
import { Info, X } from 'lucide-react';

const InteractiveMap = () => {
    const { t, i18n } = useTranslation();
    const [selectedArea, setSelectedArea] = useState(null);

    const handleAreaClick = (area) => {
        setSelectedArea(area);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 h-[full] min-h-[600px] relative">
            {/* Map Container - HUD Style */}
            <div className="flex-1 bg-gray-900 border border-ftc-green/30 relative overflow-hidden rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] group">
                {/* HUD Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-ftc-green z-10"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-ftc-green z-10"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-ftc-green z-10"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-ftc-green z-10"></div>

                {/* HUD Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(110,231,183,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(110,231,183,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>

                <TransformWrapper
                    initialScale={1}
                    minScale={0.5}
                    maxScale={4}
                    centerOnInit
                >
                    {({ zoomIn, zoomOut, resetTransform, setTransform }) => (
                        <>
                            {/* Controls */}
                            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                                <button onClick={() => zoomIn()} className="w-10 h-10 bg-black/50 text-ftc-green font-bold border border-ftc-green hover:bg-ftc-green hover:text-black transition-all backdrop-blur">+</button>
                                <button onClick={() => zoomOut()} className="w-10 h-10 bg-black/50 text-ftc-green font-bold border border-ftc-green hover:bg-ftc-green hover:text-black transition-all backdrop-blur">-</button>
                                <button onClick={() => resetTransform()} className="w-10 h-10 bg-black/50 text-ftc-green font-bold border border-ftc-green hover:bg-ftc-green hover:text-black transition-all backdrop-blur">R</button>
                            </div>

                            <TransformComponent wrapperClass="w-full h-full" contentClass="w-full h-full">
                                <div className="relative w-full h-full min-h-[600px] bg-gray-900/50">
                                    <img
                                        src={mapImage}
                                        alt="Event Map"
                                        className="w-full h-full object-contain pointer-events-none select-none opacity-90"
                                    />

                                    {/* Overlay Zones */}
                                    {mapAreas.map((area) => (
                                        <motion.div
                                            key={area.id}
                                            className={clsx(
                                                "absolute cursor-pointer border-2 border-transparent hover:border-white transition-colors",
                                                selectedArea?.id === area.id ? "bg-white/30 border-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" : "bg-transparent"
                                            )}
                                            style={{
                                                top: `${area.y}%`,
                                                left: `${area.x}%`,
                                                width: `${area.width}%`,
                                                height: `${area.height}%`,
                                                transform: area.rotation ? `rotate(${area.rotation}deg)` : 'none'
                                            }}
                                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent deselecting if map has click handler
                                                handleAreaClick(area);
                                            }}
                                        />
                                    ))}

                                    {/* Pin Drop for Selected */}
                                    {selectedArea && (
                                        <motion.div
                                            initial={{ y: -50, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute z-10 pointer-events-none"
                                            style={{
                                                top: `${selectedArea.y - 10}%`,
                                                left: `${selectedArea.x + selectedArea.width / 2}%`,
                                                transform: 'translateX(-50%)'
                                            }}
                                        >
                                            <div className="text-4xl">📍</div>
                                        </motion.div>
                                    )}
                                </div>
                            </TransformComponent>
                        </>
                    )}
                </TransformWrapper>
            </div>

            {/* Sidebar / Info Panel */}
            <div className="w-full md:w-80 glass-panel p-4 flex flex-col h-auto md:h-auto rounded-lg border border-ftc-green/20">
                <h3 className="text-xl font-bold mb-4 uppercase flex items-center gap-2 text-ftc-green tracking-widest border-b border-ftc-green/20 pb-2">
                    <Info className="animate-pulse" />
                    {t('map.title')}
                </h3>

                <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-1">
                    {mapAreas.map(area => (
                        <button
                            key={area.id}
                            onClick={() => setSelectedArea(area)}
                            className={clsx(
                                "w-full text-left p-3 border border-transparent font-mono transition-all text-sm uppercase relative overflow-hidden group",
                                selectedArea?.id === area.id
                                    ? "bg-ftc-green/20 text-ftc-green border-ftc-green/50 box-glow"
                                    : "hover:bg-white/5 hover:border-gray-600 text-gray-400 hover:text-white"
                            )}
                        >
                            <div className={clsx("absolute left-0 top-0 bottom-0 w-[2px] transition-all", selectedArea?.id === area.id ? "bg-ftc-green" : "bg-transparent group-hover:bg-gray-600")}></div>
                            {i18n.language === 'en' ? area.name : area.nameVi}
                        </button>
                    ))}
                </div>

                {/* Detail Box */}
                <AnimatePresence mode="wait">
                    {selectedArea ? (
                        <motion.div
                            key={selectedArea.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="p-4 bg-black/60 border border-ftc-green/30 rounded mt-auto relative"
                        >
                            <div className="absolute top-0 right-0 p-1">
                                <button onClick={() => setSelectedArea(null)} className="text-gray-500 hover:text-white"><X size={14} /></button>
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg text-ftc-green text-glow font-sans uppercase">
                                    {i18n.language === 'en' ? selectedArea.name : selectedArea.nameVi}
                                </h4>
                            </div>

                            <p className="text-sm text-gray-300 font-mono leading-relaxed">
                                &gt; {i18n.language === 'en' ? selectedArea.description : selectedArea.descriptionVi}
                            </p>
                        </motion.div>
                    ) : (
                        <div className="p-4 bg-white/5 border border-dashed border-gray-700 text-gray-500 text-center italic mt-auto font-mono text-xs">
                    // {t('map.instruction')}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default InteractiveMap;
