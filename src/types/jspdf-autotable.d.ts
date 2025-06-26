declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';
  const autoTable: (doc: jsPDF, options: any) => void;
  export default autoTable;
}
