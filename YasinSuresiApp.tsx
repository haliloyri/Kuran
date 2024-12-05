import React, { useState, useMemo } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface Verse {
  page: number;
  verseNumber: number;
  arabicText: string;
  arabicReading: string;
  turkishMeaning: string;
}

const YasinSuresiApp: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [memorizedVerses, setMemorizedVerses] = useState<{[key: string]: boolean}>({});

  // Complete Yasin Suresi verse data
  const yasinVerses: Verse[] = [
    {
      page: 1,
      verseNumber: 1,
      arabicText: "يَس",
      arabicReading: "yā sīn",
      turkishMeaning: "Yasin (Harfi Mukatta)"
    },
    {
      page: 1,
      verseNumber: 2,
      arabicText: "وَالْقُرْءَانِ الْحَكِيمِ",
      arabicReading: "wal-qur'ānil-ḥakīm",
      turkishMeaning: "Hikmet sahibi Kur'an'a andolsun ki"
    },
    {
      page: 1,
      verseNumber: 3,
      arabicText: "إِنَّكَ لَمِنَ الْمُرْسَلِينَ",
      arabicReading: "innaka laminal-mursalīn",
      turkishMeaning: "Şüphesiz sen, gönderilen peygamberlerdensin"
    },
    {
      page: 1,
      verseNumber: 4,
      arabicText: "عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ",
      arabicReading: "'alā ṣirāṭin mustaqīm",
      turkishMeaning: "Dosdoğru bir yol üzerindesin"
    },
    {
      page: 1,
      verseNumber: 5,
      arabicText: "تَنزِيلَ الْعَزِيزِ الرَّحِيمِ",
      arabicReading: "tanzīlal-'azīzir-raḥīm",
      turkishMeaning: "Güçlü ve Rahim olan Allah'ın indirmesidir"
    },
    {
      page: 1,
      verseNumber: 6,
      arabicText: "لِتُنذِرَ قَوْمًا مَّا أُنذِرَ آبَاؤُهُمْ فَهُمْ غَافِلُونَ",
      arabicReading: "li-tundhira qawman mā undhira ābā'uhum fahum ghāfilūn",
      turkishMeaning: "Babaları uyarılmamış bir kavmi uyarman için (gönderildin). Onlar gaflet içindedirler"
    }
  ];

  // Group verses by page
  const pageVerses = useMemo(() => {
    return yasinVerses.reduce((acc, verse) => {
      if (!acc[verse.page]) acc[verse.page] = [];
      acc[verse.page].push(verse);
      return acc;
    }, {} as Record<number, Verse[]>);
  }, [yasinVerses]);

  // Calculate memorization percentage for each page
  const pageMemorizationPercentage = useMemo(() => {
    const percentages: {[key: number]: number} = {};
    
    Object.keys(pageVerses).forEach(page => {
      const totalVerses = pageVerses[Number(page)].length;
      const memorizedCount = pageVerses[Number(page)].filter(verse => 
        memorizedVerses[`${verse.page}-${verse.verseNumber}`]
      ).length;
      
      percentages[Number(page)] = (memorizedCount / totalVerses) * 100;
    });
    
    return percentages;
  }, [pageVerses, memorizedVerses]);

  // Toggle memorization status
  const toggleMemorization = (page: number, verseNumber: number) => {
    const key = `${page}-${verseNumber}`;
    setMemorizedVerses(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Yasin Suresi</h1>
      
      {/* Page Selection */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {Object.keys(pageVerses).map(page => {
          const memorizationPercentage = pageMemorizationPercentage[Number(page)] || 0;
          
          return (
            <button
              key={page}
              onClick={() => {
                setSelectedPage(Number(page));
                setSelectedVerse(null);
              }}
              className={`p-2 rounded relative ${
                selectedPage === Number(page) 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-200 hover:bg-blue-300'
              }`}
            >
              {page}. Sayfa
              <span 
                className={`absolute top-0 right-0 text-xs px-1 rounded-full ${
                  memorizationPercentage === 100 
                    ? 'bg-green-500 text-white'
                    : 'bg-yellow-300 text-black'
                }`}
              >
                {memorizationPercentage.toFixed(0)}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Verse Selection */}
      {selectedPage && (
        <div className="mb-4">
          <select 
            onChange={(e) => {
              const verse = pageVerses[selectedPage].find(
                v => v.verseNumber === Number(e.target.value)
              );
              setSelectedVerse(verse || null);
            }}
            className="w-full p-2 border rounded"
            defaultValue=""
          >
            <option value="" disabled>Ayet Seçin</option>
            {pageVerses[selectedPage]
              .sort((a, b) => a.verseNumber - b.verseNumber)
              .map(verse => {
                const key = `${verse.page}-${verse.verseNumber}`;
                const isMemorized = memorizedVerses[key];
                
                return (
                  <option 
                    key={verse.verseNumber} 
                    value={verse.verseNumber}
                    className={isMemorized ? 'bg-green-100' : 'bg-white'}
                  >
                    {verse.verseNumber}. Ayet {isMemorized ? '✓' : ''}
                  </option>
                );
              })}
          </select>
        </div>
      )}

      {/* Verse Details */}
      {selectedVerse && (
        <div className="border rounded p-4 bg-white">
          <div className="flex justify-between items-center mb-4">
            <p className="text-right font-arabic text-2xl flex-grow">
              {selectedVerse.arabicText}
            </p>
            <button 
              onClick={() => toggleMemorization(selectedVerse.page, selectedVerse.verseNumber)}
              className={`ml-4 p-2 rounded flex items-center ${
                memorizedVerses[`${selectedVerse.page}-${selectedVerse.verseNumber}`]
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {memorizedVerses[`${selectedVerse.page}-${selectedVerse.verseNumber}`] 
                ? <><CheckCircle2 className="mr-2" /> Ezberlendi</> 
                : <><Circle className="mr-2" /> Ezberle</>}
            </button>
          </div>
          <p className="mb-2">
            <strong>Arapça Okunuş:</strong> {selectedVerse.arabicReading}
          </p>
          <p>
            <strong>Türkçe Meali:</strong> {selectedVerse.turkishMeaning}
          </p>
        </div>
      )}
    </div>
  );
};

export default YasinSuresiApp;
