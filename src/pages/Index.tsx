import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Territory {
  id: number;
  name: string;
  pollution: number;
  greenery: number;
  owner: string | null;
  type: 'forest' | 'city' | 'water' | 'desert';
}

interface Competitor {
  id: number;
  name: string;
  color: string;
  score: number;
  territories: number;
  avatar: string;
}

interface GameAction {
  type: 'clean' | 'plant' | 'build';
  name: string;
  energyCost: number;
  effect: string;
  icon: string;
}

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [roundTime, setRoundTime] = useState(180);
  const [currentRound, setCurrentRound] = useState(1);
  const [playerEnergy, setPlayerEnergy] = useState(100);
  const [playerScore, setPlayerScore] = useState(0);
  const [selectedTerritory, setSelectedTerritory] = useState<number | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  const [territories, setTerritories] = useState<Territory[]>([
    { id: 1, name: 'Северный лес', pollution: 60, greenery: 20, owner: null, type: 'forest' },
    { id: 2, name: 'Мегаполис-Центр', pollution: 80, greenery: 10, owner: null, type: 'city' },
    { id: 3, name: 'Восточная река', pollution: 70, greenery: 15, owner: null, type: 'water' },
    { id: 4, name: 'Южная пустошь', pollution: 90, greenery: 5, owner: null, type: 'desert' },
    { id: 5, name: 'Западный парк', pollution: 40, greenery: 40, owner: null, type: 'forest' },
    { id: 6, name: 'Промзона', pollution: 95, greenery: 5, owner: null, type: 'city' },
    { id: 7, name: 'Озеро Кристалл', pollution: 50, greenery: 30, owner: null, type: 'water' },
    { id: 8, name: 'Горная долина', pollution: 30, greenery: 50, owner: null, type: 'forest' },
  ]);

  const [competitors, setCompetitors] = useState<Competitor[]>([
    { id: 1, name: 'Алекс Грин', color: 'bg-blue-500', score: 0, territories: 0, avatar: '🧑' },
    { id: 2, name: 'Мария Эко', color: 'bg-purple-500', score: 0, territories: 0, avatar: '👩' },
    { id: 3, name: 'Иван Чистов', color: 'bg-orange-500', score: 0, territories: 0, avatar: '👨' },
  ]);

  const gameActions: GameAction[] = [
    { type: 'clean', name: 'Очистить', energyCost: 20, effect: '-30% загрязнения', icon: 'Sparkles' },
    { type: 'plant', name: 'Озеленить', energyCost: 25, effect: '+25% зелени', icon: 'TreePine' },
    { type: 'build', name: 'Построить', energyCost: 35, effect: 'Эко-сооружение', icon: 'Building2' },
  ];

  useEffect(() => {
    if (gameStarted && roundTime > 0) {
      const timer = setInterval(() => {
        setRoundTime(prev => {
          if (prev <= 1) {
            simulateCompetitorActions();
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

  const startGame = () => {
    setShowIntro(false);
    setGameStarted(true);
    setRoundTime(180);
    setCurrentRound(1);
    setPlayerEnergy(100);
    setPlayerScore(0);
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

  const performAction = (action: GameAction, territoryId: number) => {
    if (playerEnergy < action.energyCost) return;

    setPlayerEnergy(prev => prev - action.energyCost);
    
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

  const getTerritoryColor = (type: string) => {
    switch (type) {
      case 'forest': return 'from-green-600 to-emerald-700';
      case 'city': return 'from-gray-600 to-slate-700';
      case 'water': return 'from-blue-600 to-cyan-700';
      case 'desert': return 'from-amber-600 to-orange-700';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTerritoryIcon = (type: string) => {
    switch (type) {
      case 'forest': return 'TreePine';
      case 'city': return 'Building2';
      case 'water': return 'Waves';
      case 'desert': return 'Mountain';
      default: return 'MapPin';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const allCompetitors = [
    { name: 'Вы', score: playerScore, territories: territories.filter(t => t.owner === 'Вы').length, color: 'bg-green-500', avatar: '🎯' },
    ...competitors
  ].sort((a, b) => b.score - a.score);

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

      <Dialog open={showIntro} onOpenChange={setShowIntro}>
        <DialogContent className="max-w-3xl bg-gradient-to-br from-green-50 to-emerald-100 text-foreground">
          <DialogHeader>
            <div 
              className="w-full h-48 mb-4 rounded-lg bg-cover bg-center"
              style={{
                backgroundImage: `url('https://cdn.poehali.dev/projects/e5b36923-5495-417c-a5dd-5a767f433b53/files/2d73e245-fee8-47e7-9263-2173c8b86efc.jpg')`
              }}
            />
            <DialogTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3">
              <Icon name="Leaf" size={36} className="text-green-600" />
              Добро пожаловать в Гринеква!
            </DialogTitle>
            <DialogDescription className="text-base space-y-4 text-foreground/90">
              <p className="text-lg font-semibold text-center">
                "Создавая что-то новое, не забудь об охране экологии"
              </p>
              
              <div className="bg-white/50 p-4 rounded-lg">
                <h4 className="font-bold mb-2 text-lg">📍 Ваша миссия:</h4>
                <p>
                  Вы находитесь в виртуальном мире <strong>"Эмеральт"</strong> — копии нашей планеты. 
                  Это практическое испытание вместо обычного собеседования. Покажите свои навыки эко-менеджера!
                </p>
              </div>

              <div className="bg-white/50 p-4 rounded-lg">
                <h4 className="font-bold mb-2 text-lg">🎯 Цель игры:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Очищайте загрязнённые территории быстрее конкурентов</li>
                  <li>Озеленяйте земли и стройте эко-сооружения</li>
                  <li>Захватывайте контроль над территориями (pollution ≤20%, greenery ≥70%)</li>
                  <li>Набирайте больше очков, чем другие кандидаты</li>
                </ul>
              </div>

              <div className="bg-white/50 p-4 rounded-lg">
                <h4 className="font-bold mb-2 text-lg">⚡ Ресурсы:</h4>
                <p>
                  У вас есть <strong>100 единиц энергии</strong> на раунд. Каждое действие стоит энергии. 
                  Используйте её мудро!
                </p>
              </div>

              <div className="text-center pt-4">
                <Button size="lg" onClick={startGame} className="hover-scale text-lg px-8">
                  <Icon name="Rocket" size={24} className="mr-2" />
                  Начать испытание!
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Icon name="Leaf" size={40} className="text-green-400 animate-pulse" />
              <div>
                <h1 className="text-3xl font-bold">Эмеральт: Эко-Стратегия</h1>
                <p className="text-green-300 text-sm">Испытание для Гринеква</p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <Badge variant="outline" className="text-lg px-4 py-2 bg-white/10 border-white/30">
                <Icon name="Clock" size={18} className="mr-2" />
                {formatTime(roundTime)}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2 bg-white/10 border-white/30">
                <Icon name="Zap" size={18} className="mr-2 text-yellow-400" />
                {playerEnergy} энергии
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2 bg-green-500 border-green-400">
                <Icon name="Trophy" size={18} className="mr-2" />
                {playerScore} очков
              </Badge>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-slate-800/50 border-green-500/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Map" size={24} className="text-green-400" />
                  Карта территорий Эмеральта
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Кликните на территорию, чтобы выполнить действие
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {territories.map((territory) => (
                    <Card
                      key={territory.id}
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedTerritory === territory.id 
                          ? 'ring-4 ring-green-400 scale-105' 
                          : ''
                      } ${territory.owner ? 'border-2 border-yellow-400' : ''}`}
                      onClick={() => setSelectedTerritory(territory.id)}
                    >
                      <CardHeader className={`p-3 bg-gradient-to-br ${getTerritoryColor(territory.type)} text-white rounded-t-lg`}>
                        <div className="flex items-center justify-between">
                          <Icon name={getTerritoryIcon(territory.type) as any} size={24} />
                          {territory.owner && (
                            <Badge className="text-xs bg-yellow-400 text-black">
                              {territory.owner}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-sm mt-2">{territory.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 space-y-2 bg-slate-700">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-red-300">Загрязнение</span>
                            <span className="text-white font-bold">{territory.pollution}%</span>
                          </div>
                          <Progress value={territory.pollution} className="h-2 bg-slate-600" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-green-300">Зелень</span>
                            <span className="text-white font-bold">{territory.greenery}%</span>
                          </div>
                          <Progress value={territory.greenery} className="h-2 bg-slate-600" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedTerritory && (
              <Card className="bg-green-900/50 border-green-400 backdrop-blur animate-scale-in">
                <CardHeader>
                  <CardTitle className="text-white">
                    Выберите действие для: {territories.find(t => t.id === selectedTerritory)?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {gameActions.map((action) => (
                      <Button
                        key={action.type}
                        onClick={() => performAction(action, selectedTerritory)}
                        disabled={playerEnergy < action.energyCost}
                        className="flex flex-col items-center gap-2 h-auto py-4 hover-scale"
                        variant={playerEnergy >= action.energyCost ? 'default' : 'secondary'}
                      >
                        <Icon name={action.icon as any} size={28} />
                        <span className="font-bold">{action.name}</span>
                        <span className="text-xs">{action.effect}</span>
                        <Badge variant="outline" className="mt-1">
                          <Icon name="Zap" size={12} className="mr-1" />
                          {action.energyCost}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card className="bg-purple-900/50 border-purple-400 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Users" size={24} className="text-purple-300" />
                  Таблица лидеров
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Конкуренты за место в Гринеква
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {allCompetitors.map((comp, index) => (
                  <div 
                    key={comp.name}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      comp.name === 'Вы' 
                        ? 'bg-green-600/30 border-2 border-green-400' 
                        : 'bg-slate-700/50'
                    } animate-fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-2xl font-bold text-yellow-400">
                      {index + 1}
                    </div>
                    <div className={`w-10 h-10 rounded-full ${comp.color} flex items-center justify-center text-2xl`}>
                      {comp.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white">{comp.name}</div>
                      <div className="text-xs text-gray-300">
                        {comp.territories} территорий
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-300">{comp.score}</div>
                      <div className="text-xs text-gray-300">очков</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-blue-900/50 border-blue-400 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Info" size={24} className="text-blue-300" />
                  Подсказка
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200 text-sm space-y-2">
                <p>💡 <strong>Стратегия:</strong> Фокусируйтесь на территориях с низким загрязнением — их легче захватить!</p>
                <p>⚡ <strong>Энергия:</strong> Планируйте действия. Энергия восстанавливается каждый раунд.</p>
                <p>🏆 <strong>Победа:</strong> Территория переходит вам при загрязнении ≤20% и зелени ≥70%.</p>
              </CardContent>
            </Card>

            <Card className="bg-amber-900/50 border-amber-400 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Target" size={24} className="text-amber-300" />
                  Ваш прогресс
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1 text-gray-200">
                    <span>Контролируемые территории</span>
                    <span className="font-bold">{territories.filter(t => t.owner === 'Вы').length} / {territories.length}</span>
                  </div>
                  <Progress 
                    value={(territories.filter(t => t.owner === 'Вы').length / territories.length) * 100} 
                    className="h-2" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Badge variant="outline" className="justify-center py-2 bg-white/10">
                    <Icon name="Sparkles" size={16} className="mr-1" />
                    {territories.filter(t => t.owner === 'Вы').length} очищено
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2 bg-white/10">
                    <Icon name="Award" size={16} className="mr-1" />
                    Раунд {currentRound}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
