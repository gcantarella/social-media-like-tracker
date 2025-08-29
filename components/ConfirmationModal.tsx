import React, { useState, useEffect } from 'react';
import { InfoIcon } from './Icons';

interface ConfirmationModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmButtonVariant?: 'primary' | 'danger';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Conferma',
    cancelText = 'Annulla',
    confirmButtonVariant = 'primary',
}) => {
    const [isShowing, setIsShowing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsShowing(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsShowing(false);
        setTimeout(onCancel, 300);
    };
    
    const handleConfirm = () => {
        setIsShowing(false);
        setTimeout(onConfirm, 300);
    };

    const confirmButtonClasses = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    };

    return (
        <div
            className={`fixed inset-0 bg-gray-900 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out ${isShowing ? 'bg-opacity-50' : 'bg-opacity-0'}`}
            onClick={handleClose}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
            aria-describedby="confirmation-message"
        >
            <div
                className={`bg-white rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8 relative transform transition-all duration-300 ease-out ${isShowing ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start">
                    <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${confirmButtonVariant === 'danger' ? 'bg-red-100' : 'bg-indigo-100'} sm:mx-0 sm:h-10 sm:w-10`}>
                       <InfoIcon className={`h-6 w-6 ${confirmButtonVariant === 'danger' ? 'text-red-600' : 'text-indigo-600'}`} aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-bold text-gray-900" id="confirmation-title">
                            {title}
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-600" id="confirmation-message">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 sm:mt-5 sm:flex sm:flex-row-reverse sm:gap-3">
                    <button
                        type="button"
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm ${confirmButtonClasses[confirmButtonVariant]}`}
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </button>
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
                        onClick={handleClose}
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
