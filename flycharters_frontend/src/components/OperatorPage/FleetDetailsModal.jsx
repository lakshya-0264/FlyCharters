import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteFleet } from "../../api/authAPI";
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlane, FaUsers, FaWeightHanging, FaTachometerAlt, FaCalendarAlt, FaInfoCircle, FaCheck, FaTimes, FaLock } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

const FleetDetailsModal = ({ fleet, onClose }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    // Auto-change background image every 4 seconds
    useEffect(() => {
        if (fleet.fleetInnerImages && fleet.fleetInnerImages.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => 
                    (prevIndex + 1) % fleet.fleetInnerImages.length
                );
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [fleet.fleetInnerImages]);

    const handleDelete = async () => {
        if (!fleet.isAdminVerify) return; // Prevent deletion if not verified
        
        setIsDeleting(true);
        try {
            const response = await deleteFleet(fleet._id);
            if (response.data.success) {
                alert('Fleet deleted successfully');
                onClose();
                window.location.reload(); 
            } else {
                alert(response.data.message || 'Failed to delete fleet');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert(error.response?.data?.message || 'Error deleting fleet');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleUpdate = () => {
        if (!fleet.isAdminVerify) return; // Prevent update if not verified
        
        navigate('addFleet', { 
            state: { 
                fleetData: {
                    ...fleet,
                    _id: fleet._id,
                    eom: fleet.eom.split('T')[0], 
                    validityTill: fleet.validityTill.split('T')[0]
                } 
            } 
        });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const currentBackgroundImage = fleet.fleetInnerImages && fleet.fleetInnerImages.length > 0 
        ? fleet.fleetInnerImages[currentImageIndex] 
        : null;

    const isVerified = fleet.isAdminVerify;

    return (
        <AnimatePresence>
            <div className="notification-overlay" onClick={onClose}></div>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex justify-center items-center z-[1001] p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="bg-white rounded-xl relative border border-[#e0e0e0] shadow-[0_12px_30px_rgba(0,0,0,0.3)] flex flex-col"
                    style={{ 
                        width: '90%',
                        maxWidth: '800px',
                        height: '90vh',
                        maxHeight: '800px'
                    }}
                >
                    {/* Close Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-light transition-colors duration-200 z-30 bg-black bg-opacity-30 rounded-full w-8 h-8 flex items-center justify-center"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        &times;
                    </motion.button>

                    {/* Header with Background Image */}
                    <div 
                        className="relative p-6 border-b border-gray-200 rounded-t-xl overflow-hidden"
                        style={{
                            backgroundImage: currentBackgroundImage ? `url(${currentBackgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            minHeight: '120px'
                        }}
                    >
                        {/* Overlay for better text readability */}
                        <div className="absolute inset-0  bg-opacity-50"></div>
                        
                        <div className="relative z-10 text-center">
                            <div className="flex items-center justify-center mb-2">
                                <h2 className="text-2xl font-bold text-white mr-3">{fleet.name}</h2>
                                {isVerified ? (
                                    <div className="flex items-center bg-green-500 bg-opacity-20 px-2 py-1 rounded-full border border-green-300 border-opacity-30">
                                        <MdVerified className="text-green-400 text-sm mr-1" />
                                        <span className="text-green-300 text-xs font-medium">Verified</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center bg-red-500 bg-opacity-20 px-2 py-1 rounded-full border border-red-300 border-opacity-30">
                                        <FaLock className="text-red-400 text-sm mr-1" />
                                        <span className="text-red-300 text-xs font-medium">Unverified</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-gray-200 text-lg">{fleet.model}</p>
                            
                            {/* Image indicators */}
                            {fleet.fleetInnerImages && fleet.fleetInnerImages.length > 1 && (
                                <div className="flex justify-center mt-3 space-x-1">
                                    {fleet.fleetInnerImages.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto flex-1 p-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <FaUsers className="text-blue-500 text-xl mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Capacity</p>
                                <p className="font-bold text-lg text-gray-800">{fleet.capacity}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                                <FaTachometerAlt className="text-green-500 text-xl mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Speed</p>
                                <p className="font-bold text-lg text-gray-800">{fleet.cruisingSpeed} kts</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg text-center">
                                <FaWeightHanging className="text-purple-500 text-xl mx-auto mb-2" />
                                <p className="text-sm text-gray-600">AUW</p>
                                <p className="font-bold text-lg text-gray-800">{fleet.auw}</p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg text-center">
                                <FaCalendarAlt className="text-orange-500 text-xl mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Status</p>
                                <p className={`font-bold text-lg ${
                                    fleet.status.toLowerCase() === 'available' ? 'text-green-600' : 'text-yellow-600'
                                }`}>
                                    {fleet.status}
                                </p>
                            </div>
                        </div>

                        {/* Basic Information Section */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b border-gray-200 pb-2">
                                <FaInfoCircle className="mr-3 text-[#061953]" />
                                Aircraft Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                                        <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{fleet.description || "No description provided"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Registration Number</p>
                                        <p className="text-gray-800 font-mono bg-gray-50 p-3 rounded-lg">{fleet.aircraftRegn}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Entry of Service</p>
                                        <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{formatDate(fleet.eom)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Valid Until</p>
                                        <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{formatDate(fleet.validityTill)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Capabilities Section */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b border-gray-200 pb-2">
                                <FaPlane className="mr-3 text-[#061953]" />
                                Aircraft Capabilities
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700 font-medium">Short Runway Landing</span>
                                    <div className="flex items-center">
                                        {fleet.isAbleToLandShortRunway ? (
                                            <>
                                                <FaCheck className="text-green-500 mr-2" />
                                                <span className="text-green-600 font-medium">Capable</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaTimes className="text-red-500 mr-2" />
                                                <span className="text-red-600 font-medium">Not Capable</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700 font-medium">Uncontrolled Airport</span>
                                    <div className="flex items-center">
                                        {fleet.isAbleToLandUncontrolled ? (
                                            <>
                                                <FaCheck className="text-green-500 mr-2" />
                                                <span className="text-green-600 font-medium">Capable</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaTimes className="text-red-500 mr-2" />
                                                <span className="text-red-600 font-medium">Not Capable</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700 font-medium">Performance Limited</span>
                                    <div className="flex items-center">
                                        {fleet.isPerformanceLimited ? (
                                            <>
                                                <FaCheck className="text-yellow-500 mr-2" />
                                                <span className="text-yellow-600 font-medium">Yes</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaTimes className="text-green-500 mr-2" />
                                                <span className="text-green-600 font-medium">No</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700 font-medium">Admin Verification</span>
                                    <div className="flex items-center">
                                        {fleet.isAdminVerify ? (
                                            <>
                                                <MdVerified className="text-green-500 mr-2" />
                                                <span className="text-green-600 font-medium">Verified</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaLock className="text-red-500 mr-2" />
                                                <span className="text-red-600 font-medium">Pending</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gallery Section */}
                        {fleet.fleetInnerImages && fleet.fleetInnerImages.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Interior Gallery</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {fleet.fleetInnerImages.map((img, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg overflow-hidden aspect-video">
                                            <img 
                                                src={img} 
                                                alt={`${fleet.name} interior ${index + 1}`} 
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons - Fixed at bottom */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        {!isVerified && (
                            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-700 text-center flex items-center justify-center">
                                    <FaLock className="mr-2" />
                                    Fleet must be admin verified to enable update/delete operations
                                </p>
                            </div>
                        )}
                        <div className="flex justify-end gap-3">
                            <motion.button 
                                whileHover={isVerified ? { scale: 1.03 } : {}}
                                whileTap={isVerified ? { scale: 0.97 } : {}}
                                className={`px-5 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                                    isVerified 
                                        ? 'border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer' 
                                        : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                                }`}
                                onClick={() => isVerified && setShowDeleteConfirm(true)}
                                disabled={isDeleting || !isVerified}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </motion.button>
                            <motion.button 
                                whileHover={isVerified ? { scale: 1.03 } : {}}
                                whileTap={isVerified ? { scale: 0.97 } : {}}
                                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isVerified 
                                        ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow-md cursor-pointer' 
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                onClick={handleUpdate}
                                disabled={!isVerified}
                            >
                                Update
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-[1002]"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm relative border border-gray-100"
                        >
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete {fleet.name}?</p>
                            <div className="flex justify-end gap-3">
                                <motion.button 
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 text-sm font-medium"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AnimatePresence>
    );
};

export default FleetDetailsModal;