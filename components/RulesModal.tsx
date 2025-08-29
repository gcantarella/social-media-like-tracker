import React, { useState, useEffect } from 'react';

interface RulesModalProps {
    onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
    const [isShowing, setIsShowing] = useState(false);

    useEffect(() => {
        // Animate in after a short delay to ensure the initial state is rendered before transitioning
        const timer = setTimeout(() => setIsShowing(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsShowing(false);
        // Wait for the animation to finish before calling the parent's onClose
        setTimeout(onClose, 300); // This duration should match the CSS transition duration
    };

    return (
        <div
            className={`fixed inset-0 bg-gray-900 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out ${isShowing ? 'bg-opacity-50' : 'bg-opacity-0'}`}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="rules-title"
        >
            <div
                className={`bg-white rounded-lg shadow-xl w-full max-w-lg p-6 sm:p-8 relative transform transition-all duration-300 ease-out ${isShowing ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={handleClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl leading-none"
                    aria-label="Chiudi finestra"
                >
                    &times;
                </button>
                <h2 id="rules-title" className="text-2xl font-bold text-gray-900 mb-4">Regole per i Moderatori</h2>
                <div className="space-y-4 text-gray-700">
                    <p>
                        Il tuo compito è monitorare i commenti e aggiungere like in modo strategico per massimizzare l'engagement.
                    </p>
                    <div>
                        <h3 className="font-semibold text-gray-800">Regola principale:</h3>
                        <p className="mt-1 pl-4 border-l-4 border-indigo-500">
                            Aggiungi <strong className="text-indigo-600">1 like da moderatore</strong> per ogni <strong className="text-indigo-600">3 commenti</strong> ricevuti su un post.
                        </p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-gray-800">Come funziona:</h3>
                        <ol className="list-decimal list-inside mt-1 space-y-1">
                            <li>Clicca sull'icona dei commenti <strong className="text-sky-500">(<span className="inline-block align-middle">💬</span>)</strong> per registrare ogni nuovo commento ricevuto sul social network.</li>
                            <li>Il sistema calcolerà automaticamente quando è il momento di mettere un like.</li>
                            <li>Quando la card mostra l'avviso <strong className="text-green-600">"È il momento del Like!"</strong>, clicca sull'icona del cuore <strong className="text-red-500">(<span className="inline-block align-middle">❤️</span>)</strong>.</li>
                        </ol>
                    </div>
                    <p className="pt-2 text-sm text-gray-500">
                        Seguire questa regola ci aiuta a mantenere un'interazione bilanciata e a far crescere la nostra community!
                    </p>
                </div>
                 <div className="flex justify-end mt-8">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500"
                    >
                        Ho capito!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RulesModal;