
import React, { useState } from 'react';
import { Meeting } from '../types';

interface MeetingsListProps {
  meetings: Meeting[];
  onAddMeeting: (title: string, date: Date) => void;
  onEditMeeting: (id: string, title: string, date: Date) => void;
  onDeleteMeeting: (id: string) => void;
  onOpenMeeting: (meeting: Meeting) => void;
}

const MeetingsList: React.FC<MeetingsListProps> = ({
  meetings,
  onAddMeeting,
  onEditMeeting,
  onDeleteMeeting,
  onOpenMeeting,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && date) {
      const meetingDate = new Date(date);
      if (editingId) {
        onEditMeeting(editingId, title.trim(), meetingDate);
        setEditingId(null);
      } else {
        onAddMeeting(title.trim(), meetingDate);
        setShowAddModal(false);
      }
      setTitle('');
      setDate('');
    }
  };

  const handleEdit = (meeting: Meeting) => {
    setEditingId(meeting.id);
    setTitle(meeting.title);
    setDate(new Date(meeting.date).toISOString().split('T')[0]);
    setOpenMenuId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réunion ?')) {
      onDeleteMeeting(id);
    }
    setOpenMenuId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Réunions</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
        >
          + Créer une réunion
        </button>
      </div>

      <div className="space-y-3">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            onClick={() => onOpenMeeting(meeting)}
          >
            <div>
              <h3 className="font-medium text-gray-800 mb-1">{meeting.title}</h3>
              <p className="text-sm text-gray-500">
                📅 {new Date(meeting.date).toLocaleDateString('fr-FR')}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {meeting.participants.length} participant(s)
              </p>
            </div>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === meeting.id ? null : meeting.id);
                }}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
              >
                ⋮
              </button>
              {openMenuId === meeting.id && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(meeting);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 rounded-t-lg"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(meeting.id);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-lg"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {meetings.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">Aucune réunion planifiée</p>
            <p className="text-sm">Créez votre première réunion pour commencer</p>
          </div>
        )}
      </div>

      {(showAddModal || editingId) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {editingId ? 'Modifier la réunion' : 'Créer une réunion'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre de la réunion
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Réunion équipe éducative"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de la réunion
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingId(null);
                    setTitle('');
                    setDate('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  {editingId ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsList;
