import React, { useState, useMemo } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import mapImage from '../../assets/Mapkhuvuc1 (1).jpg';
import { mapAreas } from './mapData';
import clsx from 'clsx';
import { Info, X } from 'lucide-react';

const InteractiveMap = () => {
    const { t, i18n } = useTranslation();
    const [selectedArea, setSelectedArea] = useState(null);

    const handleAreaClick = (area) => {
        setSelectedArea(area);
    };

    // Group areas by category - Memoized for performance
    const categories = useMemo(() => ['PIT AREA', 'EVENT TENT', 'OTHERS', 'PARKING'], []);
    const groupedAreas = useMemo(() => {
        return categories.reduce((acc, cat) => {
            acc[cat] = mapAreas.filter(area => area.category === cat);
            return acc;
        }, {});
    }, [categories]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[700px] relative text-black">
            {/* Map Container - Flat Retro Style */}
            <div className="flex-1 bg-white border-4 border-black relative overflow-hidden shadow-[8px_8px_0px_0px_black] group">
                <TransformWrapper
                    initialScale={1}
                    minScale={0.5}
                    maxScale={4}
                    centerOnInit
                >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                        <>
                            {/* Controls */}
                            <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
                                <button onClick={() => zoomIn()} className="w-12 h-12 bg-white text-black font-black border-4 border-black hover:bg-black hover:text-white transition-all flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none">+</button>
                                <button onClick={() => zoomOut()} className="w-12 h-12 bg-white text-black font-black border-4 border-black hover:bg-black hover:text-white transition-all flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none">-</button>
                                <button onClick={() => resetTransform()} className="w-12 h-12 bg-white text-black font-black border-4 border-black hover:bg-black hover:text-white transition-all flex items-center justify-center text-xl shadow-[4px_4px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none">R</button>
                            </div>

                            <TransformComponent wrapperClass="w-full h-full" contentClass="w-full h-full">
                                <div className="relative w-full h-full min-h-[700px] bg-white flex items-center justify-center p-4">
                                    <div
                                        className="relative w-full max-w-[1200px] aspect-[1.78]"
                                        style={{ willChange: 'transform' }}
                                    >
                                        <img
                                            src={mapImage}
                                            alt="Event Area Map"
                                            className="w-full h-full object-contain pointer-events-none select-none"
                                            style={{ opacity: 1 }}
                                        />

                                        {/* Overlay Zones */}
                                        {mapAreas.map((area) => {
                                            const isSelected = selectedArea?.id === area.id;

                                            // Handle multiple shapes or single shape
                                            const shapes = area.shapes || [{
                                                x: area.x,
                                                y: area.y,
                                                width: area.width,
                                                height: area.height,
                                                points: area.points,
                                                rotation: area.rotation
                                            }];

                                            return (
                                                <div key={area.id} className="absolute inset-0 pointer-events-none">
                                                    {shapes.map((shape, idx) => {
                                                        const clipPath = shape.points
                                                            ? `polygon(${shape.points.map(p => `${p[0]}% ${p[1]}%`).join(', ')})`
                                                            : 'none';

                                                        return (
                                                            <motion.div
                                                                key={`${area.id}-${idx}`}
                                                                initial={false}
                                                                className={clsx(
                                                                    "absolute cursor-pointer border-2 transition-all duration-200 pointer-events-auto",
                                                                    isSelected ? "border-white z-10" : "border-transparent z-0 hover:border-white/50"
                                                                )}
                                                                style={{
                                                                    top: `${shape.y}%`,
                                                                    left: `${shape.x}%`,
                                                                    width: `${shape.width}%`,
                                                                    height: `${shape.height}%`,
                                                                    transform: shape.rotation ? `rotate(${shape.rotation}deg)` : 'none',
                                                                    clipPath,
                                                                    backgroundColor: isSelected ? `${area.color}66` : 'transparent',
                                                                    boxShadow: isSelected ? `0 0 20px ${area.color}88` : 'none',
                                                                    willChange: 'background-color, border-color'
                                                                }}
                                                                whileHover={{
                                                                    backgroundColor: isSelected ? `${area.color}88` : `${area.color}22`
                                                                }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleAreaClick(area);
                                                                }}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </TransformComponent>
                        </>
                    )}
                </TransformWrapper>
            </div>

            {/* Sidebar / Grouped Legend */}
            <div className="w-full lg:w-96 flat-panel p-6 flex flex-col h-auto overflow-hidden">
                <h3 className="text-2xl font-black mb-6 uppercase flex items-center gap-3 text-black tracking-tighter border-b-4 border-black pb-3">
                    <Info size={24} />
                    {t('map.title')}
                </h3>

                <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2 custom-scrollbar">
                    {categories.map(cat => (
                        <div key={cat} className="space-y-2">
                            <h4 className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase mb-3 pl-1 border-l-4 border-black">
                                {cat}
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                                {groupedAreas[cat].map(area => (
                                    <button
                                        key={area.id}
                                        onClick={() => setSelectedArea(area)}
                                        className={clsx(
                                            "w-full text-left py-2.5 px-3 border-2 transition-all text-xs uppercase flex items-center gap-3 relative overflow-hidden group font-black font-mono",
                                            selectedArea?.id === area.id
                                                ? "bg-black text-white border-black"
                                                : "bg-white border-black hover:bg-black/5 text-black"
                                        )}
                                    >
                                        <div
                                            className="w-3 h-3 rounded-none flex-shrink-0 border border-black"
                                            style={{ backgroundColor: area.color }}
                                        />
                                        <span className="flex-1 truncate">
                                            {area.id.padStart(2, '0')}. {i18n.language === 'en' ? area.name : area.nameVi}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail Box */}
                <AnimatePresence mode="wait">
                    {selectedArea ? (
                        <motion.div
                            key={selectedArea.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="p-5 bg-white border-4 border-black shadow-[4px_4px_0px_0px_black] relative overflow-hidden"
                        >
                            <div className="absolute top-2 right-2">
                                <button onClick={() => setSelectedArea(null)} className="p-1 text-black hover:scale-110 transition-transform"><X size={20} /></button>
                            </div>

                            <h4 className="font-black text-xl text-black mb-3 font-mono uppercase italic">
                                {i18n.language === 'en' ? selectedArea.name : selectedArea.nameVi}
                            </h4>

                            <p className="text-sm text-gray-800 font-sans leading-relaxed font-bold">
                                {i18n.language === 'en' ? selectedArea.description : selectedArea.descriptionVi}
                            </p>

                            <div className="mt-4 pt-4 border-t-2 border-black flex justify-between items-center text-[10px] font-black font-mono text-black">
                                <span className="uppercase">Zone {selectedArea.id}</span>
                                <span className="uppercase">{selectedArea.category}</span>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="p-6 bg-black/5 border-4 border-dashed border-black/20 text-black/40 text-center font-black italic font-mono text-xs">
                            &gt;// SELECT_AREA_FOR_INTEL
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default InteractiveMap;
