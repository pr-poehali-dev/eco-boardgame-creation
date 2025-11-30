import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import GameRulesDialog from '@/components/game/GameRulesDialog';
import TerritoryMap, { Territory, GameAction } from '@/components/game/TerritoryMap';
import ResourceManagement, { ResourceCard } from '@/components/game/ResourceManagement';
import Sidebar, { Competitor } from '@/components/game/Sidebar';

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [roundTime, setRoundTime] = useState(180);
  const [currentRound, setCurrentRound] = useState(1);
  const [playerCurrency, setPlayerCurrency] = useState(400);
  const [playerScore, setPlayerScore] = useState(0);
  const [resourceCards, setResourceCards] = useState<ResourceCard[]>([]);
  const [selectedTerritory, setSelectedTerritory] = useState<number | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  const [territories, setTerritories] = useState<Territory[]>([
    { id: 1, name: 'Озеро', pollution: 20, greenery: 60, owner: null, type: 'lake' },
    { id: 2, name: 'Озеро со сливом', pollution: 85, greenery: 15, owner: null, type: 'polluted-lake' },
    { id: 3, name: 'Городской парк', pollution: 45, greenery: 50, owner: null, type: 'park' },
    { id: 4, name: 'Лесная опушка', pollution: 30, greenery: 65, owner: null, type: 'forest-edge' },
    { id: 5, name: 'Лес', pollution: 25, greenery: 75, owner: null, type: 'forest' },
    { id: 6, name: 'Промышленная зона', pollution: 95, greenery: 5, owner: null, type: 'industrial' },
    { id: 7, name: 'Поле', pollution: 40, greenery: 55, owner: null, type: 'field' },
    { id: 8, name: 'Овраг', pollution: 70, greenery: 20, owner: null, type: 'ravine' },
  ]);

  const [competitors, setCompetitors] = useState<Competitor[]>([
    { id: 1, name: 'Алексей Зеленский', color: 'bg-blue-500', score: 0, territories: 0, avatar: '🧑' },
    { id: 2, name: 'Мария Лесникова', color: 'bg-purple-500', score: 0, territories: 0, avatar: '👩' },
    { id: 3, name: 'Иван Чистяков', color: 'bg-orange-500', score: 0, territories: 0, avatar: '👨' },
  ]);

  const gameActions: GameAction[] = [
    { type: 'clean', name: 'Очистить', materialsCost: 15, foodCost: 5, waterCost: 10, energyCost: 20, effect: '-30% загрязнения', icon: 'Sparkles' },
    { type: 'plant', name: 'Озеленить', materialsCost: 10, foodCost: 8, waterCost: 15, energyCost: 15, effect: '+25% зелени', icon: 'TreePine' },
    { type: 'build', name: 'Построить', materialsCost: 30, foodCost: 10, waterCost: 5, energyCost: 30, effect: 'Эко-сооружение', icon: 'Building2' },
  ];

  useEffect(() => {
    if (gameStarted && roundTime > 0) {
      const timer = setInterval(() => {
        setRoundTime(prev => {
          if (prev <= 1) {
            simulateCompetitorActions();
            restoreResources();
            setCurrentRound(r => r + 1);
            return 180;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, roundTime]);

  useEffect(() => {
    if (gameStarted) {
      const aiInterval = setInterval(() => {
        simulateCompetitorActions();
      }, 8000);
      return () => clearInterval(aiInterval);
    }
  }, [gameStarted]);

  const generateRandomCard = (type: ResourceCard['type']): ResourceCard => {
    const values: (5 | 10 | 20)[] = [5, 10, 20];
    const randomValue = values[Math.floor(Math.random() * values.length)];
    return {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      value: randomValue
    };
  };

  const startGame = () => {
    setShowIntro(false);
    setGameStarted(true);
    setRoundTime(180);
    setCurrentRound(1);
    setPlayerCurrency(400);
    setPlayerScore(0);
    
    const initialCards: ResourceCard[] = [
      generateRandomCard('materials'),
      generateRandomCard('food'),
      generateRandomCard('water'),
      generateRandomCard('energy')
    ];
    setResourceCards(initialCards);
  };

  const restoreResources = () => {
    setPlayerCurrency(prev => prev + 200);
  };

  const buyResourceCard = (type: ResourceCard['type']) => {
    if (playerCurrency < 50) return;
    setPlayerCurrency(prev => prev - 50);
    const newCard = generateRandomCard(type);
    setResourceCards(prev => [...prev, newCard]);
  };

  const sellResourceCard = (cardId: string) => {
    setPlayerCurrency(prev => prev + 20);
    setResourceCards(prev => prev.filter(card => card.id !== cardId));
  };

  const getTotalResourceValue = (type: ResourceCard['type']) => {
    return resourceCards
      .filter(card => card.type === type)
      .reduce((sum, card) => sum + card.value, 0);
  };

  const simulateCompetitorActions = () => {
    setCompetitors(prev => prev.map(comp => ({
      ...comp,
      score: comp.score + Math.floor(Math.random() * 15) + 5,
      territories: comp.territories + (Math.random() > 0.7 ? 1 : 0)
    })));

    setTerritories(prev => prev.map(terr => {
      if (Math.random() > 0.85 && !terr.owner) {
        const randomComp = competitors[Math.floor(Math.random() * competitors.length)];
        return {
          ...terr,
          pollution: Math.max(0, terr.pollution - 10),
          greenery: Math.min(100, terr.greenery + 10),
          owner: randomComp.name
        };
      }
      return terr;
    }));
  };

  const canPerformAction = (action: GameAction) => {
    return getTotalResourceValue('materials') >= action.materialsCost &&
           getTotalResourceValue('food') >= action.foodCost &&
           getTotalResourceValue('water') >= action.waterCost &&
           getTotalResourceValue('energy') >= action.energyCost;
  };

  const spendResources = (type: ResourceCard['type'], amount: number) => {
    let remaining = amount;
    const newCards = [...resourceCards];
    
    for (let i = newCards.length - 1; i >= 0 && remaining > 0; i--) {
      if (newCards[i].type === type) {
        if (newCards[i].value <= remaining) {
          remaining -= newCards[i].value;
          newCards.splice(i, 1);
        }
      }
    }
    
    setResourceCards(newCards);
  };

  const performAction = (action: GameAction, territoryId: number) => {
    if (!canPerformAction(action)) return;

    spendResources('materials', action.materialsCost);
    spendResources('food', action.foodCost);
    spendResources('water', action.waterCost);
    spendResources('energy', action.energyCost);
    
    setTerritories(prev => prev.map(terr => {
      if (terr.id === territoryId) {
        let newPollution = terr.pollution;
        let newGreenery = terr.greenery;
        
        if (action.type === 'clean') {
          newPollution = Math.max(0, terr.pollution - 30);
          setPlayerScore(prev => prev + 20);
        } else if (action.type === 'plant') {
          newGreenery = Math.min(100, terr.greenery + 25);
          setPlayerScore(prev => prev + 25);
        } else if (action.type === 'build') {
          newPollution = Math.max(0, terr.pollution - 20);
          newGreenery = Math.min(100, terr.greenery + 15);
          setPlayerScore(prev => prev + 35);
        }

        if (newPollution <= 20 && newGreenery >= 70 && !terr.owner) {
          return { ...terr, pollution: newPollution, greenery: newGreenery, owner: 'Вы' };
        }
        
        return { ...terr, pollution: newPollution, greenery: newGreenery };
      }
      return terr;
    }));

    setSelectedTerritory(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 text-white">
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('https://cdn.poehali.dev/projects/e5b36923-5495-417c-a5dd-5a767f433b53/files/f44e3038-7278-43a7-a2ac-6bf120d7f9e5.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />

      <GameRulesDialog 
        showIntro={showIntro} 
        setShowIntro={setShowIntro} 
        startGame={startGame} 
      />

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Icon name="Leaf" size={40} className="text-green-400 animate-pulse" />
              <div>
                <h1 className="text-3xl font-bold">Эко-миссия: Спасение природы</h1>
                <p className="text-green-300 text-sm">Испытание от Гринеква</p>
              </div>
            </div>

            <div className="flex gap-3 items-center flex-wrap">
              <Badge variant="outline" className="text-lg px-4 py-2 bg-white/10 border-white/30">
                <Icon name="Clock" size={18} className="mr-2" />
                {formatTime(roundTime)}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2 bg-emerald-600 border-emerald-400">
                <Icon name="CircleDollarSign" size={18} className="mr-2" />
                {playerCurrency} ₽
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2 bg-green-500 border-green-400">
                <Icon name="Trophy" size={18} className="mr-2" />
                {playerScore}
              </Badge>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <TerritoryMap 
              territories={territories}
              selectedTerritory={selectedTerritory}
              setSelectedTerritory={setSelectedTerritory}
              gameActions={gameActions}
              canPerformAction={canPerformAction}
              performAction={performAction}
            />
          </div>

          <div className="space-y-4">
            <Sidebar 
              competitors={competitors}
              playerScore={playerScore}
              territories={territories}
              currentRound={currentRound}
            />
            
            <ResourceManagement 
              playerCurrency={playerCurrency}
              resourceCards={resourceCards}
              buyResourceCard={buyResourceCard}
              sellResourceCard={sellResourceCard}
              getTotalResourceValue={getTotalResourceValue}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
