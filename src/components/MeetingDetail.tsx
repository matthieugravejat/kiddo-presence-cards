import React, { useState, useEffect } from 'react';
import { Meeting, Professional, Participant } from '../types';
import SignatureCanvas from './SignatureCanvas';
//import { exportToPDF } from '../utils/pdfExport';


interface MeetingDetailProps {
  meeting: Meeting;
  professionals: Professional[];
  onBack: () => void;
  onUpdateMeeting: (meeting: Meeting) => void;
}

const MeetingDetail: React.FC<MeetingDetailProps> = ({
  meeting,
  professionals,
  onBack,
  onUpdateMeeting,
}) => {
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState('');
  const [signingParticipant, setSigningParticipant] = useState<Participant | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  const availableProfessionals = professionals.filter(
    (prof) => !meeting.participants.some((p) => p.professionalId === prof.id)
  );

  const handleAddParticipant = () => {
    if (selectedProfessionalId) {
      const newParticipant: Participant = {
        id: Date.now().toString(),
        professionalId: selectedProfessionalId,
      };

      const updatedMeeting = {
        ...meeting,
        participants: [...meeting.participants, newParticipant],
      };

      onUpdateMeeting(updatedMeeting);
      setShowAddParticipant(false);
      setSelectedProfessionalId('');
    }
  };

  const handleRemoveParticipant = (participantId: string) => {
    if (confirm('Êtes-vous sûr de vouloir retirer ce participant de la réunion ?')) {
      const updatedMeeting = {
        ...meeting,
        participants: meeting.participants.filter((p) => p.id !== participantId),
      };
      onUpdateMeeting(updatedMeeting);
    }
    setOpenMenuId(null);
  };

  const handleSignature = (signature: string) => {
    if (signingParticipant) {
      const updatedParticipants = meeting.participants.map((p) =>
        p.id === signingParticipant.id
          ? { ...p, signature, signedAt: new Date() }
          : p
      );

      const updatedMeeting = {
        ...meeting,
        participants: updatedParticipants,
      };

      onUpdateMeeting(updatedMeeting);
      setSigningParticipant(null);
    }
  };

  const getProfessionalName = (professionalId: string) => {
    const prof = professionals.find((p) => p.id === professionalId);
    return prof ? `${prof.firstName} ${prof.lastName}` : 'Professionnel inconnu';
  };

  const handleExportPDF = () => {
    //exportToPDF(meeting, professionals);
  };


  const handleMenuToggle = (participantId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === participantId ? null : participantId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors duration-200"
        >
          ← Retour aux réunions
        </button>
        <button
          //onClick={handleExportPDF}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
        >
          📄 Exporter PDF
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{meeting.title}</h1>
        <p className="text-gray-600">
          📅 {new Date(meeting.date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Participants ({meeting.participants.length})
        </h2>
        <button
          onClick={() => setShowAddParticipant(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
          disabled={availableProfessionals.length === 0}
        >
          + Ajouter un participant
        </button>
      </div>

      {meeting.participants.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4 font-medium text-gray-700">Nom & Prénom</th>
                <th className="text-left p-4 font-medium text-gray-700">Signature</th>
                <th className="text-center p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {meeting.participants.map((participant) => (
                <tr key={participant.id} className="border-t border-gray-100">
                  <td className="p-4">
                    <div className="font-medium text-gray-800">
                      {getProfessionalName(participant.professionalId)}
                    </div>
                    {participant.signedAt && (
                      <div className="text-xs text-green-600 mt-1">
                        Signé le {new Date(participant.signedAt).toLocaleString('fr-FR')}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    {participant.signature ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={participant.signature}
                          alt="Signature"
                          className="h-12 border border-gray-200 rounded bg-white"
                        />
                        <button
                          onClick={() => setSigningParticipant(participant)}
                          className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                        >
                          Modifier
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSigningParticipant(participant)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Signer
                      </button>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="relative">
                      <button
                        onClick={(e) => handleMenuToggle(participant.id, e)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        ⋮
                      </button>
                      {openMenuId === participant.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg z-20 border">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveParticipant(participant.id);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-lg"
                          >
                            🗑️ Retirer de la réunion
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">Aucun participant ajouté</p>
          <p className="text-sm">Commencez par ajouter des participants à cette réunion</p>
        </div>
      )}

      {showAddParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Ajouter un participant
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner un professionnel
              </label>
              <select
                value={selectedProfessionalId}
                onChange={(e) => setSelectedProfessionalId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choisir un professionnel...</option>
                {availableProfessionals.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.firstName} {prof.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddParticipant(false);
                  setSelectedProfessionalId('');
                }}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleAddParticipant}
                disabled={!selectedProfessionalId}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {signingParticipant && (
        <SignatureCanvas
          onSave={handleSignature}
          onCancel={() => setSigningParticipant(null)}
          existingSignature={signingParticipant.signature}
        />
      )}
    </div>
  );
};

export default MeetingDetail;
