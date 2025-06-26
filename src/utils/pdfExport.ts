
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Meeting, Professional } from '../types';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import autoTable from 'jspdf-autotable';


/*
export const exportToPDF = async (meeting: Meeting, professionals: Professional[]) => {
  try {
    // Créer un élément temporaire pour le contenu du PDF
    const element = document.createElement('div');
    element.style.padding = '40px';
    element.style.backgroundColor = 'white';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.width = '800px';
    element.style.minHeight = '600px';

    // Contenu HTML
    element.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3B82F6; padding-bottom: 20px;">
        <h1 style="color: #1F2937; font-size: 24px; margin: 0;">Fiche de Présence</h1>
        <h2 style="color: #3B82F6; font-size: 20px; margin: 10px 0;">${meeting.title}</h2>
        <p style="color: #6B7280; font-size: 14px; margin: 5px 0;">
          Date: ${new Date(meeting.date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #F3F4F6;">
            <th style="border: 1px solid #D1D5DB; padding: 12px; text-align: left; font-weight: bold; color: #374151;">
              Nom & Prénom
            </th>
            <th style="border: 1px solid #D1D5DB; padding: 12px; text-align: center; font-weight: bold; color: #374151;">
              Signature
            </th>
            <th style="border: 1px solid #D1D5DB; padding: 12px; text-align: center; font-weight: bold; color: #374151;">
              Date de signature
            </th>
          </tr>
        </thead>
        <tbody>
          ${meeting.participants.map((participant) => {
            const professional = professionals.find(p => p.id === participant.professionalId);
            const name = professional ? `${professional.firstName} ${professional.lastName}` : 'Professionnel inconnu';
            const signedDate = participant.signedAt 
              ? new Date(participant.signedAt).toLocaleDateString('fr-FR') 
              : '-';
            
            return `
              <tr>
                <td style="border: 1px solid #D1D5DB; padding: 12px; color: #374151;">
                  ${name}
                </td>
                <td style="border: 1px solid #D1D5DB; padding: 12px; text-align: center;">
                  ${participant.signature 
                    ? `<img src="${participant.signature}" style="max-height: 40px; max-width: 150px;" alt="Signature" />`
                    : '<span style="color: #9CA3AF; font-style: italic;">Non signé</span>'
                  }
                </td>
                <td style="border: 1px solid #D1D5DB; padding: 12px; text-align: center; color: #374151;">
                  ${signedDate}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; text-align: center; color: #6B7280; font-size: 12px;">
        <p>Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
        <p>Maison d'Enfants - Fiche de présence numérique</p>
      </div>
    `;

    // Ajouter temporairement à la page
    document.body.appendChild(element);

    // Attendre que les images se chargent
    const images = element.querySelectorAll('img');
    await Promise.all(Array.from(images).map(img => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve(null);
        } else {
          img.onload = () => resolve(null);
          img.onerror = () => resolve(null);
        }
      });
    }));

    // Générer le canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: element.scrollHeight
    });

    // Supprimer l'élément temporaire
    document.body.removeChild(element);

    // Créer le PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // Largeur A4 en mm
    const pageHeight = 295; // Hauteur A4 en mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Ajouter la première page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Ajouter des pages supplémentaires si nécessaire
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Sauvegarder le PDF
    const fileName = `Fiche_Presence_${meeting.title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date(meeting.date).toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error);
    alert('Une erreur est survenue lors de l\'export PDF. Veuillez réessayer.');
  }
};


*/
export const exportToPDF = async (meeting: Meeting, professionals: Professional[]) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Feuille de présence', 14, 20);
  doc.setFontSize(12);
  doc.text(`Titre : ${meeting.title}`, 14, 30);
  doc.text(`Date : ${new Date(meeting.date).toLocaleDateString()}`, 14, 37);

  const tableData = meeting.participants.map((p, index) => {
    const prof = professionals.find(pro => pro.id === p.professionalId);
    return [
      index + 1,
      `${prof?.firstName || ''} ${prof?.lastName || ''}`,
      '✍️'
    ];
  });
  const autoTableFn = (autoTable as any) as typeof autoTable;
  autoTable(doc, {
    startY: 45,
    head: [['#', 'Nom', 'Signature']],
    body: tableData,
  });

  const base64PDF = doc.output('datauristring').split(',')[1];

  await Filesystem.writeFile({
    path: `presence-${meeting.title}-${Date.now()}.pdf`,
    data: base64PDF,
    directory: Directory.Documents,
    encoding: 'base64' as any,
  });

  console.log("PDF enregistré dans le dossier Documents.");
};

