import React, { useState, useCallback } from 'react';
import { editImage, EditImageResponse } from '../services/geminiService';
import { useQuota } from '../hooks/useQuota';
import { UploadIcon, CrossIcon } from './icons';
import { useAuth } from '../context/AuthContext';

const fileToB64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

export const Generator: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const { quota, decrementQuota, isReady } = useQuota(user);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                setError("File size must be under 4MB.");
                return;
            }
            setError(null);
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setGeneratedImageUrl(null);
        }
    };

    const handleGenerate = useCallback(async () => {
        if (!imageFile) {
            setError("Please upload an image first.");
            return;
        }
        if (isReady && quota <= 0) {
            if (!user) {
                setError("You have used all your trial generations. Please sign in for more.");
            } else {
                setError("You have used all your free generations for this month. Please subscribe for more.");
            }
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImageUrl(null);

        try {
            const base64Data = await fileToB64(imageFile);
            const response: EditImageResponse = await editImage(base64Data, imageFile.type);
            
            if (response.imageB64) {
                 setGeneratedImageUrl(`data:image/png;base64,${response.imageB64}`);
                 if (user?.tier !== 'paid') {
                    decrementQuota();
                 }
            } else {
                throw new Error(response.text || "Generation failed: No image was returned.");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [imageFile, quota, decrementQuota, user, isReady]);

    const showWatermark = user?.tier !== 'paid' && !!generatedImageUrl;

    const renderQuotaInfo = () => {
        if (!isReady || user?.tier === 'paid') {
            return null;
        }

        if (user) {
            return <p className="text-sm mt-3 text-red-400">Monthly generations left: {quota}</p>;
        }

        return <p className="text-sm mt-3 text-red-400">Free trial generations left: {quota}</p>;
    };

    return (
        <section className="py-20" id="generator">
            <div className="w-full max-w-4xl mx-auto p-6 sm:p-8 bg-black/30 border border-red-900/50 rounded-lg backdrop-blur-sm neon-box">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Left side: Upload and Controls */}
                    <div className="flex flex-col items-center justify-center h-full">
                        <label htmlFor="file-upload" className="w-full h-64 border-2 border-dashed border-red-900/70 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-red-600 transition-colors bg-black/20">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg"/>
                            ) : (
                                <div className="text-center text-gray-400">
                                    <UploadIcon className="w-12 h-12 mx-auto" />
                                    <p className="mt-2 font-semibold">Click to upload image</p>
                                    <p className="text-xs mt-1">PNG, JPG, WEBP up to 4MB</p>
                                </div>
                            )}
                        </label>
                        <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                        
                        <button 
                            onClick={handleGenerate} 
                            disabled={isLoading || !imageFile || (isReady && quota <= 0)}
                            className="w-full mt-6 py-3 px-6 bg-red-800/50 text-white font-gothic text-xl tracking-wider border-2 border-red-600 rounded-lg hover:bg-red-700 hover:neon-text disabled:bg-gray-800 disabled:border-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            {isLoading ? 'Generating...' : 'Sanctify'}
                        </button>
                        {renderQuotaInfo()}
                    </div>

                    {/* Right side: Output */}
                    <div className="w-full h-96 bg-black/20 border border-red-900/50 rounded-lg flex items-center justify-center relative">
                        {isLoading && (
                            <div className="flex flex-col items-center text-red-500">
                                <CrossIcon className="w-16 h-16 animate-spin" />
                                <p className="mt-4 font-gothic tracking-wider neon-text">AI is contemplating...</p>
                                <p className="text-xs text-gray-400 mt-2">This may take a moment.</p>
                            </div>
                        )}
                        {error && !isLoading && (
                            <div className="text-center p-4">
                                <p className="text-red-500 font-semibold">An Error Occurred</p>
                                <p className="text-sm text-gray-400 mt-2">{error}</p>
                            </div>
                        )}
                        {!isLoading && !error && generatedImageUrl && (
                             <div className="relative w-full h-full group">
                                <img src={generatedImageUrl} alt="Generated Artwork" className="w-full h-full object-contain rounded-lg"/>
                                {showWatermark && (
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/40 font-semibold text-lg pointer-events-none">
                                        www.touchfeets.com
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <a 
                                        href={generatedImageUrl} 
                                        download="touchfeets_miracle.png"
                                        className="py-3 px-8 bg-red-700 text-white font-gothic text-lg tracking-wider border-2 border-red-500 rounded-lg hover:bg-red-600 hover:neon-text transition-all duration-300"
                                    >
                                        Download
                                    </a>
                                </div>
                            </div>
                        )}
                        {!isLoading && !error && !generatedImageUrl && (
                            <div className="text-center text-gray-500 p-4">
                                <p className="font-gothic text-2xl tracking-wider">The Altar Awaits</p>
                                <p className="mt-2">Your divine image will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
