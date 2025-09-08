'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Save, X, Instagram, Facebook, Phone, MapPin, ZoomIn, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';


// DATABASE FRASI ROMANTICHE (1000 frasi)
const ROMANTIC_PHRASES = [
  "Non c'è un motivo speciale, se non che ogni giorno con te è un'occasione da festeggiare",
  "Sei il mio posto preferito dove tornare",
  "Con te anche il silenzio ha un bel suono",
  "Tu rendi speciale anche il giorno più normale",
  "Sei la mia canzone preferita in repeat",
  "Il tuo sorriso è il mio posto del cuore",
  "Tu sei la mia casa ovunque tu sia",
  "Ogni momento con te ha un sapore diverso",
  "Sei il mio raggio di sole personale",
  "Tu sei la magia che non sapevo esistesse",
  "Con te ogni giorno sa di domenica",
  "Tu sei il mio tipo di magia quotidiana",
  "Sei dolce come lo zucchero a velo",
  "Tu sei la luce dei miei giorni",
  "Con te mi sento completo",
  "Tu sei il regalo più bello che ho ricevuto",
  "Sei il sole dopo la pioggia",
  "Tu sei la mia primavera eterna",
  "Con te tutto ha più colore",
  "Sei la melodia del mio cuore",
  "Tu fai battere il mio cuore a ritmo di felicità",
  "Con te trovo la pace che cercavo",
  "Sei la mia oasi di serenità",
  "Tu sei la mia energia positiva",
  "Con te anche l'attesa diventa dolce",
  "Sei più bella di qualsiasi tramonto",
  "Tu hai una bellezza che viene dal cuore",
  "Con te tutto viene naturale",
  "Sei la mia semplicità preferita",
  "Tu sei la mia fortuna quotidiana"
];

// NUOVI CONSIGLI PER I FIORI
const flowerCareTips = [
    {
        title: "1. Taglia gli steli (nel modo giusto)",
        content: `Appena ricevi i fiori, prima ancora di metterli in acqua, devi tagliare i loro steli.<br/><br/>
        <b>Come farlo:</b> Usa delle forbici affilate o un coltellino per fare un taglio obliquo (diagonale) di circa 2-3 cm dalla base.<br/><br/>
        <b>Perché funziona:</b> Un taglio obliquo aumenta la superficie con cui lo stelo può assorbire l'acqua. Inoltre, elimina la parte finale che potrebbe essersi seccata o aver intrappolato bolle d'aria durante il trasporto, impedendo l'idratazione.<br/><br/>
        <b>Consiglio pro:</b> Se riesci, fai questo taglio tenendo gli steli immersi in acqua (ad esempio in un lavandino pieno) per evitare che l'aria entri subito nei canali dello stelo. Ripeti l'operazione ogni 2-3 giorni.`
    },
    {
        title: "2. Acqua pulita e nutrimento",
        content: `L'acqua è vita per i fiori, ma deve essere quella giusta.<br/><br/>
        <b>Come farlo:</b> Usa un vaso perfettamente pulito e riempilo con acqua fresca a temperatura ambiente. Sciogli nell'acqua la bustina di nutrimento che di solito viene fornita con i fiori. Se non ce l'hai, puoi creare una soluzione casalinga con 1 litro d'acqua, 1 cucchiaino di zucchero (nutrimento) e 2-3 gocce di candeggina o un cucchiaino di aceto (per prevenire i batteri).<br/><br/>
        <b>Perché funziona:</b> I fiori recisi hanno ancora bisogno di zuccheri per sopravvivere e di un ambiente pulito. I batteri che si formano nell'acqua stagnante o sporca sono il nemico numero uno, perché ostruiscono gli steli e "avvelenano" il fiore.<br/><br/>
        <b>Importante:</b> Cambia l'acqua completamente ogni 2 giorni, lavando il vaso e aggiungendo nuovo nutrimento.`
    },
    {
        title: "3. Rimuovi le foglie in eccesso",
        content: `Guarda bene gli steli prima di metterli nel vaso.<br/><br/>
        <b>Come farlo:</b> Togli tutte le foglie che finirebbero sotto il livello dell'acqua nel vaso. Lascia solo quelle nella parte superiore.<br/><br/>
        <b>Perché funziona:</b> Le foglie immerse in acqua marciscono rapidamente, diventando un terreno fertile per la proliferazione di batteri che, come detto sopra, danneggiano i fiori e creano cattivo odore. Questo è uno dei passaggi più importanti e spesso trascurati.`
    },
    {
        title: "4. Scegli la posizione ideale",
        content: `Dove metti il vaso fa un'enorme differenza.<br/><br/>
        <b>Come farlo:</b> Posiziona i fiori in un luogo fresco della casa, lontano da fonti di calore (termosifoni, elettrodomestici, luce solare diretta) e da correnti d'aria (finestre aperte, condizionatori).<br/><br/>
        <b>Perché funziona:</b> Il calore e la luce diretta accelerano la traspirazione e fanno appassire i fiori molto più velocemente.<br/><br/>
        <b>Un nemico insospettabile:</b> Tieni i fiori lontano dalla frutta matura. Molti frutti (come mele e banane) rilasciano etilene, un gas che accelera il processo di invecchiamento e appassimento dei fiori.<br/><br/>
        Con queste piccole attenzioni, i tuoi fiori ti regaleranno la loro bellezza per molti più giorni.`
    }
];


// FUNZIONE PER OTTENERE FRASE UNICA BASATA SU ID COMPLETO
function getUniquePhrase(fullCardId) {
  if (!fullCardId) return ROMANTIC_PHRASES[0];
  
  let seed = 0;
  for (let i = 0; i < fullCardId.length; i++) {
    seed += fullCardId.charCodeAt(i);
  }
  const index = seed % ROMANTIC_PHRASES.length;
  return ROMANTIC_PHRASES[index];
}

const YouFlowersCard = () => {
  const [fullCardId] = useState(() => {
    // In produzione: l'ID viene letto dall'URL del browser.
    // Esempio URL: https://tuosito.com/SARA-001 -> fullCardId sarà "SARA-001"
    const potentialId = window.location.pathname.split('/').pop();
    if (potentialId && potentialId.includes('-')) {
        return potentialId;
    }
    // Se l'ID non è nel formato 'FIORAIO-CODICE', usiamo un default per la demo.
    // Questo gestisce anche l'anteprima in ambienti di sviluppo con URL casuali.
    console.warn(`ID dall'URL "${potentialId}" non valido. Utilizzo default 'SARA-DEMO01'.`);
    return 'SARA-DEMO01';
  });
  
  const [floristData, setFloristData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFloristData = async () => {
      const floristCode = fullCardId.split('-')[0].toUpperCase();
      
      try {
        const response = await fetch(`/florists/${floristCode}.json`);
        if (!response.ok) {
          throw new Error(`Fioraio non trovato per il codice: ${floristCode}`);
        }
        const data = await response.json();
        setFloristData(data);
      } catch (err) {
        console.error("Errore nel caricamento dati fioraio:", err);
        // Se il fioraio specifico non viene trovato, carica un fioraio di default
        // per garantire che l'app sia sempre utilizzabile.
        try {
            const response = await fetch(`/florists/SARA.json`);
            if (!response.ok) {
                throw new Error('Anche il fioraio di fallback SARA.json non è stato trovato.');
            }
            const data = await response.json();
            setFloristData(data);
        } catch (fallbackErr) {
            console.error("Errore critico:", fallbackErr);
            setError("Impossibile caricare le informazioni del fioraio. Riprova più tardi.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFloristData();
  }, [fullCardId]);
  
  const [uniquePhrase] = useState(() => getUniquePhrase(fullCardId));
  
  const [currentImage, setCurrentImage] = useState('https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showCustomization, setShowCustomization] = useState(true);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [storyPreviewImage, setStoryPreviewImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const cardToShareRef = useRef<HTMLDivElement>(null);
  const storyToShareRef = useRef<HTMLDivElement>(null);

  const handleImageClick = () => {
    if (showCustomization) {
      setShowUploadModal(true);
    } else {
      setIsImageZoomed(true);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setCurrentImage(e.target.result);
        }
        setShowUploadModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
            setCurrentImage(e.target.result);
        }
        setShowUploadModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    setShowCustomization(false);
    setTimeout(() => setIsSaved(false), 4000);
  };

  const handleCardShare = async () => {
    if (!cardToShareRef.current) {
      alert("Impossibile condividere, elemento non trovato.");
      return;
    }

    if (!navigator.share) {
      alert("La condivisione non è supportata su questo browser.");
      return;
    }

    setIsSharing(true);
    try {
      const canvas = await html2canvas(cardToShareRef.current, {
        useCORS: true,
        backgroundColor: null, // Keep background transparent
        scale: 2 // Increase resolution for better quality
      });
      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert("Errore nella creazione dell'immagine da condividere.");
          setIsSharing(false);
          return;
        }
        
        const file = new File([blob], 'youflowers-card.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Un pensiero speciale per te!',
              text: uniquePhrase,
            });
          } catch (error) {
            console.error('Errore durante la condivisione:', error);
          }
        } else {
          alert("La condivisione di immagini non è supportata.");
        }
        
        setIsSharing(false);
      }, 'image/png');

    } catch (error) {
      console.error('Errore con html2canvas:', error);
      alert("Si è verificato un errore durante la preparazione della condivisione.");
      setIsSharing(false);
    }
  };

  const prepareStoryForSharing = async () => {
    if (!storyToShareRef.current) {
      alert("Impossibile creare la storia, elemento non trovato.");
      return;
    }

    setIsGeneratingStory(true);
    try {
      const canvas = await html2canvas(storyToShareRef.current, {
        useCORS: true,
        backgroundColor: null,
        width: 1080,
        height: 1920,
        scale: 1,
      });
      setStoryPreviewImage(canvas.toDataURL('image/png'));
    } catch (error) {
      console.error('Errore con html2canvas per la storia:', error);
      alert("Si è verificato un errore durante la preparazione della storia.");
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const executeStoryShare = async () => {
    if (!storyPreviewImage) {
      alert("Nessuna immagine di storia da condividere.");
      return;
    }

    try {
      const response = await fetch(storyPreviewImage);
      const blob = await response.blob();
      const file = new File([blob], 'youflowers-story.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Un pensiero speciale per te!',
        });
      } else {
        alert("La condivisione di immagini non è supportata in questo browser.");
      }
    } catch (error) {
      console.error('Errore durante la condivisione della storia:', error);
    } finally {
      setStoryPreviewImage(null); // Close modal after sharing
    }
  };


  const closeModal = () => {
    setShowUploadModal(false);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', background: 'linear-gradient(135deg, #8a9af5 0%, #9a72c7 100%)' }}>
        Caricamento del tuo biglietto...
      </div>
    );
  }

  if (error || !floristData) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', background: 'linear-gradient(135deg, #d32f2f 0%, #c2185b 100%)', padding: '20px', textAlign: 'center' }}>
        {error || "Si è verificato un errore."}
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh',
      width: '100%',
      maxWidth: '428px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #8a9af5 0%, #9a72c7 100%)',
      position: 'relative',
      overflowY: 'auto'
    }}>
      
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Great+Vibes&display=swap" rel="stylesheet" />
      
      {/* Elementi decorativi */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '5%',
        width: '120px',
        height: '120px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '8%',
        width: '80px',
        height: '80px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 4s ease-in-out infinite reverse'
      }}></div>

      {/* SEZIONE 1: MESSAGGIO UNICO */}
      <div ref={cardToShareRef} style={{
        height: '100vh',
        background: 'linear-gradient(135deg, #8a9af5 0%, #9a72c7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 30px',
        position: 'relative',
        zIndex: 1
      }}>
        
        <div style={{
          textAlign: 'center',
          width: '100%',
          padding: '50px 30px',
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.2)',
          opacity: 0,
          animation: 'fadeInUp 0.8s ease-out 0.2s forwards'
        }}>
          
          <div style={{
            fontSize: '32px',
            marginBottom: '25px',
            opacity: '0.8'
          }}>
            ✨💕✨
          </div>
          
          <h1 style={{
            fontSize: 'clamp(56px, 14vw, 88px)',
            lineHeight: '1.2',
            color: '#ffffff',
            fontWeight: '600',
            margin: '0 0 30px 0',
            letterSpacing: '-0.02em',
            fontFamily: '"Great Vibes", cursive',
            textShadow: '0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
            fontStyle: 'italic',
            transform: 'scale(1)',
            transition: 'all 0.4s ease',
            opacity: 0,
            animation: 'zoomInWow 1s cubic-bezier(0.25, 1, 0.5, 1) 0.5s forwards'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.textShadow = '0 6px 20px rgba(0,0,0,0.4), 0 3px 6px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.textShadow = '0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)';
          }}
          >
            {uniquePhrase}
          </h1>
          
          <div style={{
            fontSize: '28px',
            marginTop: '40px',
            marginBottom: '20px',
            opacity: '0.8'
          }}>
            🌹💝🌹
          </div>
          
          {showCustomization && (
            <div style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: '"Inter", sans-serif',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              ↓ Scorri per personalizzare ↓
            </div>
          )}
        </div>
      </div>

      {/* SEZIONE 2: BIGLIETTO DEL FIORAIO SPECIFICO */}
      <div style={{
        minHeight: '100vh',
        padding: '40px 30px',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center'
      }}>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
          padding: '40px 30px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          opacity: 0,
          animation: 'fadeInUp 0.8s ease-out 0.6s forwards'
        }}>
          
          <div style={{ marginBottom: '30px' }}>
            <p style={{
              fontSize: '18px',
              lineHeight: '1.4',
              color: '#667eea',
              fontWeight: '600',
              margin: '0',
              fontFamily: '"Dancing Script", cursive',
              fontStyle: 'italic'
            }}>
              "Un pensiero speciale per te..."
            </p>
          </div>

          {/* Foto personalizzabile */}
          <div 
            onClick={handleImageClick}
            style={{
              marginBottom: '30px',
              cursor: 'pointer',
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              border: '3px solid rgba(255, 255, 255, 0.8)'
            }}
          >
            <img 
              src={currentImage}
              alt="Foto personalizzabile"
              style={{
                width: '100%',
                height: '220px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            
            {showCustomization && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(102, 126, 234, 0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                opacity: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.85)';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(102, 126, 234, 0)';
                e.currentTarget.style.opacity = '0';
              }}
              >
                <div style={{ color: 'white', textAlign: 'center' }}>
                  <Camera size={28} style={{ marginBottom: '8px' }} />
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
                    Clicca per personalizzare
                  </p>
                </div>
              </div>
            )}
            {!showCustomization && (
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0, 0, 0, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white',
                opacity: 0,
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }}
              >
                <ZoomIn size={40} />
              </div>
            )}
          </div>

          {/* Consigli fiori */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '30px',
            border: '1px solid rgba(102, 126, 234, 0.1)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#667eea',
              margin: '0 0 18px 0',
              textAlign: 'left'
            }}>
              Consigli per mantenere al meglio i tuoi fiori
            </h3>
            <div style={{
              fontSize: '13px',
              color: '#4a5568',
              lineHeight: '1.6',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {flowerCareTips.map((tip, index) => (
                <div key={index}>
                    <h4 style={{ fontWeight: '600', color: '#5a67d8', marginBottom: '6px' }}>{tip.title}</h4>
                    <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: tip.content }}></p>
                </div>
              ))}
            </div>
          </div>

          {/* PULSANTE PERSONALIZZAZIONE */}
          {showCustomization && (
            <button
              onClick={handleSave}
              style={{
                width: '100%',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                marginBottom: '20px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
              }}
            >
              <Save size={18} style={{ marginRight: '8px' }} />
              Salva il tuo biglietto personalizzato
            </button>
          )}

          {/* Conferma salvataggio */}
          {isSaved && (
            <div style={{
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              color: 'white',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '16px',
              fontWeight: '500'
            }}>
              ✨ Biglietto salvato! Ora puoi condividerlo. ✨
            </div>
          )}
          
          {/* NUOVA SEZIONE CONDIVISIONE */}
          {!showCustomization && (
            <div style={{
              marginTop: '20px',
              marginBottom: '20px',
              background: 'rgba(102, 126, 234, 0.05)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(102, 126, 234, 0.1)'
            }}>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#667eea',
                margin: '0 0 16px 0',
                textAlign: 'center'
              }}>
                Condividi la tua sorpresa
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <button
                  onClick={handleCardShare}
                  disabled={isSharing}
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: isSharing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isSharing ? '#ccc' : 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(56, 161, 105, 0.4)',
                    opacity: isSharing ? 0.7 : 1,
                  }}
                   onMouseEnter={(e) => {
                    if(isSharing) return;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(56, 161, 105, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    if(isSharing) return;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(56, 161, 105, 0.4)';
                  }}
                >
                  <Share2 size={18} style={{ marginRight: '8px' }} />
                  {isSharing ? 'Preparando...' : 'Condividi il Biglietto'}
                </button>
          
                <button
                  onClick={prepareStoryForSharing}
                  disabled={isGeneratingStory}
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: isGeneratingStory ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isGeneratingStory ? '#ccc' : 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(228, 64, 95, 0.4)',
                    opacity: isGeneratingStory ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if(isGeneratingStory) return;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(228, 64, 95, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    if(isGeneratingStory) return;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(228, 64, 95, 0.4)';
                  }}
                >
                  <Instagram size={18} style={{ marginRight: '8px' }} />
                  {isGeneratingStory ? 'Generando...' : 'Crea Storia per Social'}
                </button>
              </div>
            </div>
          )}

          {/* INFO FIORAIO SPECIFICO */}
          <div style={{
            background: 'rgba(102, 126, 234, 0.05)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(102, 126, 234, 0.1)'
          }}>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#667eea',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              🌸 {floristData.name}
            </h4>
            
            <div style={{
              fontSize: '14px',
              color: '#4a5568',
              lineHeight: '1.6',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.5)',
                padding: '10px',
                borderRadius: '8px'
              }}>
                <Phone size={16} style={{ marginRight: '8px', color: '#667eea' }} />
                <span style={{ fontWeight: '500' }}>{floristData.phone}</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.5)',
                padding: '10px',
                borderRadius: '8px'
              }}>
                <MapPin size={16} style={{ marginRight: '8px', color: '#667eea' }} />
                <span style={{ fontWeight: '500' }}>{floristData.address}</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '20px',
                marginTop: '8px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  background: 'rgba(228, 64, 95, 0.1)',
                  padding: '8px 12px',
                  borderRadius: '20px'
                }}>
                  <Instagram size={16} style={{ marginRight: '6px', color: '#E4405F' }} />
                  <span style={{ fontSize: '12px', fontWeight: '500' }}>@{floristData.instagram}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  background: 'rgba(24, 119, 242, 0.1)',
                  padding: '8px 12px',
                  borderRadius: '20px'
                }}>
                  <Facebook size={16} style={{ marginRight: '6px', color: '#1877F2' }} />
                  <span style={{ fontSize: '12px', fontWeight: '500' }}>{floristData.facebook}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Upload */}
      {showUploadModal && showCustomization && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            width: '100%',
            maxWidth: '300px',
            position: 'relative',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#718096',
                padding: '4px'
              }}
            >
              <X size={18} />
            </button>
            
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              textAlign: 'center',
              margin: '0 0 20px 0',
              color: '#2d3748'
            }}>
              Personalizza la tua foto
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <button
                onClick={() => cameraInputRef.current?.click()}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
              >
                <Camera size={18} style={{ marginRight: '8px' }} />
                Scatta una foto
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <Upload size={18} style={{ marginRight: '8px' }} />
                Carica dalla galleria
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      )}
      
      {/* Modal Zoom Immagine */}
      {isImageZoomed && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            cursor: 'pointer',
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => setIsImageZoomed(false)}
        >
          <button
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'white',
              padding: '8px',
            }}
          >
            <X size={32} />
          </button>
          <img
            src={currentImage}
            alt="Foto ingrandita"
            style={{
              maxWidth: '95vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
              borderRadius: '8px',
              cursor: 'default'
            }}
            onClick={(e) => e.stopPropagation()} // Impedisce la chiusura del modal cliccando sull'immagine
          />
        </div>
      )}

      {/* Modal Anteprima Storia */}
      {storyPreviewImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            width: '100%',
            maxWidth: '360px',
            position: 'relative',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <button
              onClick={() => setStoryPreviewImage(null)}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#718096',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>
            
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              textAlign: 'center',
              margin: '0 0 12px 0',
              color: '#2d3748'
            }}>
              La tua Storia è Pronta
            </h3>
            <p style={{
                textAlign: 'center',
                color: '#4a5568',
                fontSize: '14px',
                marginBottom: '20px',
                lineHeight: '1.5'
            }}>
                Clicca su "Condividi" e seleziona <b>Instagram</b> (o un'altra app social) per pubblicarla.
            </p>

            <img
                src={storyPreviewImage}
                alt="Anteprima della storia"
                style={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '9 / 16',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '24px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
            />

            <button
                onClick={executeStoryShare}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(228, 64, 95, 0.4)'
                }}
                 onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(228, 64, 95, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(228, 64, 95, 0.4)';
                  }}
            >
                <Share2 size={18} style={{ marginRight: '8px' }} />
                Condividi
            </button>
          </div>
        </div>
      )}

      {/* TEMPLATE NASCOSTO PER STORIA SOCIAL */}
      <div
        ref={storyToShareRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '1080px',
          height: '1920px',
          background: 'linear-gradient(160deg, #8a9af5 0%, #9a72c7 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          boxSizing: 'border-box',
          fontFamily: '"Inter", sans-serif',
        }}
      >
        <img
          src={currentImage}
          crossOrigin="anonymous"
          style={{
            width: '80%',
            height: 'auto',
            aspectRatio: '1 / 1',
            objectFit: 'cover',
            borderRadius: '40px',
            border: '10px solid white',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        />
        <h1 style={{
          fontFamily: '"Great Vibes", cursive',
          fontSize: '150px',
          color: 'white',
          textAlign: 'center',
          marginTop: '60px',
          textShadow: '0 5px 15px rgba(0,0,0,0.4)',
          fontStyle: 'italic',
          lineHeight: '1.2',
          maxWidth: '90%',
        }}>
          {uniquePhrase}
        </h1>
        {floristData && (
          <div style={{
            position: 'absolute',
            bottom: '80px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.8)',
          }}>
            <p style={{ margin: '0', fontSize: '32px' }}>Un pensiero da</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '48px', fontWeight: 'bold', color: 'white' }}>
              {floristData.name}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes zoomInWow {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default YouFlowersCard;
