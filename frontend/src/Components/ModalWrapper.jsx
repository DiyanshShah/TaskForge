import React from 'react'

const ModalWrapper = ({title, onClose, children}) => {
return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 p-6 rounded-lg w-full max-w-lg shadow-xl"
                onClick={(e) => e.stopPropagation()} 
            >
                <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
                
                
                {children}
            </div>
        </div>
    );
}

export default ModalWrapper
