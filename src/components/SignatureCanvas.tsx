
import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignatureCanvasProps {
  onSave: (signature: string) => void;
  onCancel: () => void;
  existingSignature?: string;
}

export interface SignatureCanvasRef {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: () => string;
}

const CustomSignatureCanvas = forwardRef<SignatureCanvasRef, SignatureCanvasProps>(
  ({ onSave, onCancel, existingSignature }, ref) => {
    const sigCanvasRef = useRef<SignatureCanvas>(null);

    useImperativeHandle(ref, () => ({
      clear: () => sigCanvasRef.current?.clear(),
      isEmpty: () => sigCanvasRef.current?.isEmpty() ?? true,
      toDataURL: () => sigCanvasRef.current?.toDataURL() ?? '',
    }));

    const handleSave = () => {
      if (sigCanvasRef.current) {
        if (sigCanvasRef.current.isEmpty()) {
          alert('Veuillez signer avant de valider');
          return;
        }
        const signature = sigCanvasRef.current.toDataURL();
        onSave(signature);
      }
    };

    const handleClear = () => {
      sigCanvasRef.current?.clear();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            {existingSignature ? 'Modifier la signature' : 'Signer'}
          </h3>
          
          <div className="border-2 border-gray-300 rounded-lg mb-4 bg-white">
            <SignatureCanvas
              ref={sigCanvasRef}
              canvasProps={{
                width: 600,
                height: 200,
                className: 'signature-canvas rounded-lg',
                style: { width: '100%', height: '200px' }
              }}
              backgroundColor="white"
            />
          </div>
          
          <p className="text-sm text-gray-500 mb-4 text-center">
            Utilisez votre doigt ou stylet pour signer dans la zone ci-dessus
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Annuler
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Effacer
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Valider
            </button>
          </div>
        </div>
      </div>
    );
  }
);

CustomSignatureCanvas.displayName = 'CustomSignatureCanvas';

export default CustomSignatureCanvas;
