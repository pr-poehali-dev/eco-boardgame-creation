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
  type: 'lake' | 'polluted-lake' | 'park' | 'forest-edge' | 'forest' | 'industrial' | 'field' | 'ravine';
}

interface Competitor {
  id: number;
  name: string;
  color: string;
  score: number;
  territories: number;
  avatar: string;
}

interface ResourceCard {
  id: string;
  type: 'materials' | 'food' | 'water' | 'energy';
  value: 5 | 10 | 20;
}

interface GameAction {
  type: 'clean' | 'plant' | 'build';
  name: string;
  materialsCost: number;
  foodCost: number;
  waterCost: number;
  energyCost: number;
  effect: string;
  icon: string;
}

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

  const getTerritoryColor = (type: string) => {
    switch (type) {
      case 'lake': return 'from-blue-500 to-cyan-600';
      case 'polluted-lake': return 'from-gray-700 to-slate-800';
      case 'park': return 'from-green-500 to-emerald-600';
      case 'forest-edge': return 'from-lime-600 to-green-700';
      case 'forest': return 'from-green-700 to-emerald-800';
      case 'industrial': return 'from-gray-600 to-zinc-700';
      case 'field': return 'from-yellow-600 to-amber-600';
      case 'ravine': return 'from-orange-700 to-red-800';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTerritoryIcon = (type: string) => {
    switch (type) {
      case 'lake': return 'Droplets';
      case 'polluted-lake': return 'Waves';
      case 'park': return 'TreeDeciduous';
      case 'forest-edge': return 'Trees';
      case 'forest': return 'TreePine';
      case 'industrial': return 'Factory';
      case 'field': return 'Wheat';
      case 'ravine': return 'Mountain';
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
              Правила игры
            </DialogTitle>
            <DialogDescription className="text-base space-y-4 text-foreground/90 max-h-[60vh] overflow-y-auto">
              <div className="bg-green-100 p-4 rounded-lg border-2 border-green-500">
                <h4 className="font-bold mb-2 text-xl text-green-800">🟢 Лёгкий режим (2-4 игрока)</h4>
                <ul className="space-y-2 text-sm">
                  <li>• В начале: <strong>600 валюты</strong> и <strong>по 2 карточки</strong> каждого ресурса</li>
                  <li>• Каждый круг: <strong>+300 валюты</strong></li>
                  <li>• Когда есть деньги, всё становится проще, не так ли?</li>
                  <li>• В остальном всё то же самое</li>
                </ul>
              </div>

              <div className="bg-red-100 p-4 rounded-lg border-2 border-red-500">
                <h4 className="font-bold mb-3 text-xl text-red-800">🔴 Сложный режим (2-4 игрока)</h4>
                
                <div className="space-y-3 text-sm">
                  <p><strong>Подготовка:</strong></p>
                  <ul className="space-y-1 ml-4">
                    <li>• Выберите цвет фишки</li>
                    <li>• Разложите поле прямоугольником (9 ячеек)</li>
                    <li>• Каждый занимает 1 угловую ячейку (фишка точкой вверх)</li>
                    <li>• Перемешайте карточки событий</li>
                  </ul>

                  <p><strong>Начальные ресурсы:</strong></p>
                  <ul className="space-y-1 ml-4">
                    <li>• 400 валюты</li>
                    <li>• По 1 карточке каждого ресурса (случайный номинал)</li>
                    <li>• Каждый круг: +200 валюты</li>
                  </ul>

                  <p><strong>Ход игры:</strong></p>
                  <ul className="space-y-1 ml-4">
                    <li>• Первый игрок берёт карточку событий и зачитывает</li>
                    <li>• Можно купить/продать/обменять ресурсы</li>
                    <li>• 1 карточка ресурса = 50 валюты (покупка из банка)</li>
                    <li>• Продажа в банк = +20 валюты (любой номинал)</li>
                  </ul>

                  <p><strong>Территории:</strong></p>
                  <ul className="space-y-1 ml-4">
                    <li>• Можно занимать соседние ячейки (вертикально/горизонтально)</li>
                    <li>• Неочищенная мини-ячейка: -10 валюты за круг</li>
                    <li>• За полную очистку ячейки: +100 валюты (один раз)</li>
                    <li>• У каждой ячейки 4 мини-ячейки и карточка миссии</li>
                  </ul>

                  <p><strong>Мониторинг:</strong></p>
                  <ul className="space-y-1 ml-4">
                    <li>• Защищает от негативных событий</li>
                    <li>• Приносит ресурсы/валюту каждый круг</li>
                    <li>• Стоит 5 энергии за ход</li>
                    <li>• Без энергии: штраф 30 валюты, нет сбора ресурсов</li>
                  </ul>

                  <p><strong>⚠️ Важно:</strong></p>
                  <ul className="space-y-1 ml-4">
                    <li>• Сдача только с валюты</li>
                    <li>• Ресурсы без сдачи: сколько отдали, столько забрали</li>
                    <li>• Без мониторинга платите за события или теряете мини-ячейки</li>
                  </ul>
                </div>
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
            <Card className="bg-slate-800/50 border-green-500/30 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Map" size={24} className="text-green-400" />
                  Карта территорий
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Выберите территорию для выполнения действия
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
                    Выберите действие: {territories.find(t => t.id === selectedTerritory)?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {gameActions.map((action) => {
                      const canAct = canPerformAction(action);
                      return (
                        <Button
                          key={action.type}
                          onClick={() => performAction(action, selectedTerritory)}
                          disabled={!canAct}
                          className="flex flex-col items-center gap-2 h-auto py-4 hover-scale"
                          variant={canAct ? 'default' : 'secondary'}
                        >
                          <Icon name={action.icon as any} size={28} />
                          <span className="font-bold">{action.name}</span>
                          <span className="text-xs">{action.effect}</span>
                          <div className="flex gap-2 mt-1 flex-wrap justify-center">
                            <Badge variant="outline" className="text-xs">
                              <Icon name="Hammer" size={10} className="mr-1" />
                              {action.materialsCost}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Icon name="UtensilsCrossed" size={10} className="mr-1" />
                              {action.foodCost}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Icon name="Droplet" size={10} className="mr-1" />
                              {action.waterCost}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Icon name="Zap" size={10} className="mr-1" />
                              {action.energyCost}
                            </Badge>
                          </div>
                          <div className="flex gap-2 mt-1 flex-wrap justify-center">
                            <Badge variant="outline" className="text-xs">
                              <Icon name="Hammer" size={10} className="mr-1" />
                              {action.materialsCost}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Icon name="UtensilsCrossed" size={10} className="mr-1" />
                              {action.foodCost}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Icon name="Droplet" size={10} className="mr-1" />
                              {action.waterCost}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Icon name="Zap" size={10} className="mr-1" />
                              {action.energyCost}
                            </Badge>
                          </div>
                        </Button>
                      );
                    })}
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

            <Card className="bg-orange-900/50 border-orange-400 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="ShoppingCart" size={24} className="text-orange-300" />
                  Магазин ресурсов
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Покупка: 50₽ | Продажа: 20₽
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => buyResourceCard('materials')} 
                    disabled={playerCurrency < 50}
                    size="sm"
                    className="flex flex-col h-auto py-2"
                  >
                    <Icon name="Hammer" size={16} />
                    <span className="text-xs">Купить</span>
                  </Button>
                  <Button 
                    onClick={() => buyResourceCard('food')} 
                    disabled={playerCurrency < 50}
                    size="sm"
                    className="flex flex-col h-auto py-2"
                  >
                    <Icon name="UtensilsCrossed" size={16} />
                    <span className="text-xs">Купить</span>
                  </Button>
                  <Button 
                    onClick={() => buyResourceCard('water')} 
                    disabled={playerCurrency < 50}
                    size="sm"
                    className="flex flex-col h-auto py-2"
                  >
                    <Icon name="Droplet" size={16} />
                    <span className="text-xs">Купить</span>
                  </Button>
                  <Button 
                    onClick={() => buyResourceCard('energy')} 
                    disabled={playerCurrency < 50}
                    size="sm"
                    className="flex flex-col h-auto py-2"
                  >
                    <Icon name="Zap" size={16} />
                    <span className="text-xs">Купить</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-400 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Wallet" size={24} className="text-slate-300" />
                  Ваши карточки ресурсов
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['materials', 'food', 'water', 'energy'].map((type) => {
                  const cards = resourceCards.filter(c => c.type === type);
                  const total = getTotalResourceValue(type as ResourceCard['type']);
                  const iconName = type === 'materials' ? 'Hammer' : type === 'food' ? 'UtensilsCrossed' : type === 'water' ? 'Droplet' : 'Zap';
                  const colorClass = type === 'materials' ? 'bg-orange-500/20' : type === 'food' ? 'bg-amber-500/20' : type === 'water' ? 'bg-blue-500/20' : 'bg-yellow-500/20';
                  
                  return (
                    <div key={type} className={`p-3 rounded-lg ${colorClass}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon name={iconName as any} size={18} />
                          <span className="font-bold text-white">Итого: {total}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cards.length === 0 ? (
                          <span className="text-xs text-gray-400">Нет карточек</span>
                        ) : (
                          cards.map((card) => (
                            <Badge 
                              key={card.id}
                              className="cursor-pointer hover:bg-red-500"
                              onClick={() => sellResourceCard(card.id)}
                            >
                              {card.value}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-blue-900/50 border-blue-400 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Info" size={24} className="text-blue-300" />
                  Подсказки
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-200 text-sm space-y-2">
                <p>💡 Территория ваша при загрязнении ≤20% и зелени ≥70%</p>
                <p>💰 Каждый круг +200₽</p>
                <p>🎲 Карточки с номиналом 5, 10, 20</p>
                <p>🛒 Клик на карточку — продать за 20₽</p>
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