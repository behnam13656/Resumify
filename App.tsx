import React, { useState, useRef, useEffect } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { ResumeData } from './types';
import { BLANK_RESUME_DATA } from './constants';
import { DownloadIcon, EditIcon, EyeIcon } from './components/icons';
import { translations } from './i18n';
import styles from './App.module.css';

// Make jsPDF and html2canvas available from the window object
declare global {
    interface Window {
        jspdf: any;
        html2canvas: any;
    }
}
export type Language = 'fa' | 'en';
export type Template = 'visual' | 'ats';


const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('fa');
  const [resumeData, setResumeData] = useState<ResumeData>(BLANK_RESUME_DATA);
  const [view, setView] = useState<'editor' | 'preview'>('editor');
  const [template, setTemplate] = useState<Template>('visual');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const previewRef = useRef<HTMLDivElement>(null);
  
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
  }, [language]);


  const handleDownloadPdf = async () => {
      if (!previewRef.current) return;
      setIsLoading(true);

      const { jsPDF } = window.jspdf;

      if (template === 'visual') {
          const canvas = await window.html2canvas(previewRef.current, { scale: 3 });
          const imgData = canvas.toDataURL('image/png');
          
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
          });

          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          pdf.save('resume-visual.pdf');
          setIsLoading(false);
      } else { // ATS-friendly template
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4'
          });

          await pdf.html(previewRef.current, {
              callback: function (doc) {
                  doc.save('resume-ats.pdf');
                  setIsLoading(false);
              },
              margin: [40, 40, 40, 40],
              autoPaging: 'text',
              html2canvas: {
                  scale: 0.75, // Adjust scale for better rendering
                  useCORS: true
              },
              width: 515, // A4 width (595pt) - margins (40*2)
              windowWidth: 800,
          });
      }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{t.resumeBuilder}</h1>
          <div className={styles.controls}>
            <div className={styles.buttonGroup}>
              <button onClick={() => setLanguage('fa')} className={`${styles.button} ${styles.langButton} ${language === 'fa' ? styles.active : ''}`}>فارسی</button>
              <button onClick={() => setLanguage('en')} className={`${styles.button} ${styles.langButton} ${language === 'en' ? styles.active : ''}`}>English</button>
            </div>
            <div className={styles.buttonGroup}>
              <button onClick={() => setTemplate('visual')} className={`${styles.button} ${styles.templateButton} ${template === 'visual' ? styles.active : ''}`}>{t.visualTemplate}</button>
              <button onClick={() => setTemplate('ats')} className={`${styles.button} ${styles.templateButton} ${template === 'ats' ? styles.active : ''}`}>{t.atsFriendly}</button>
            </div>
            <div className={styles.buttonGroup}>
              <button
                onClick={() => setView('editor')}
                className={`${styles.button} ${view === 'editor' ? styles.active : ''}`}
              >
                <EditIcon />
                {t.edit}
              </button>
              <button
                onClick={() => setView('preview')}
                className={`${styles.button} ${view === 'preview' ? styles.active : ''}`}
              >
                <EyeIcon />
                {t.preview}
              </button>
            </div>
            <button
              onClick={handleDownloadPdf}
              disabled={isLoading}
              className={styles.downloadButton}
            >
              {isLoading ? (
                <>
                  <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle style={{opacity: 0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{opacity: 0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.building}
                </>
              ) : (
                <>
                  <DownloadIcon />
                  {t.downloadPdf}
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        {view === 'editor' ? (
          <Editor data={resumeData} setData={setResumeData} t={t} />
        ) : (
          <div className={styles.previewWrapper}>
            <Preview data={resumeData} t={t} template={template} />
          </div>
        )}
      </main>
      
      {/* Hidden preview for PDF generation */}
      <div className={styles.hiddenPreview}>
          <div ref={previewRef} className={styles.hiddenPreviewInner}>
              <Preview data={resumeData} t={t} template={template} />
          </div>
      </div>
    </div>
  );
};

export default App;