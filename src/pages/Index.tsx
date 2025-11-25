import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Mission {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  progress: number;
  icon: string;
  completed: boolean;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface EcoFact {
  id: number;
  title: string;
  content: string;
  category: string;
  icon: string;
}

const Index = () => {
  const [userLevel, setUserLevel] = useState(5);
  const [userPoints, setUserPoints] = useState(1250);
  const [levelProgress, setLevelProgress] = useState(45);

  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 1,
      title: 'Раздельный сбор отходов',
      description: 'Начни сортировать мусор дома: бумага, пластик, стекло',
      category: 'Переработка',
      difficulty: 'easy',
      points: 100,
      progress: 75,
      icon: 'Recycle',
      completed: false
    },
    {
      id: 2,
      title: 'Неделя без пластика',
      description: 'Откажись от одноразового пластика на 7 дней',
      category: 'Потребление',
      difficulty: 'medium',
      points: 200,
      progress: 40,
      icon: 'ShoppingBag',
      completed: false
    },
    {
      id: 3,
      title: 'Экономия воды',
      description: 'Сократи расход воды на 30% за месяц',
      category: 'Ресурсы',
      difficulty: 'medium',
      points: 150,
      progress: 60,
      icon: 'Droplet',
      completed: false
    },
    {
      id: 4,
      title: 'Посади дерево',
      description: 'Посади дерево или примі участие в субботнике',
      category: 'Природа',
      difficulty: 'hard',
      points: 300,
      progress: 0,
      icon: 'TreePine',
      completed: false
    },
    {
      id: 5,
      title: 'Велосипед вместо авто',
      description: 'Используй велосипед или общественный транспорт неделю',
      category: 'Транспорт',
      difficulty: 'medium',
      points: 180,
      progress: 20,
      icon: 'Bike',
      completed: false
    },
    {
      id: 6,
      title: 'Энергоэффективность',
      description: 'Замени 3 лампы на энергосберегающие',
      category: 'Энергия',
      difficulty: 'easy',
      points: 120,
      progress: 0,
      icon: 'Lightbulb',
      completed: false
    }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 1,
      title: 'Эко-новичок',
      description: 'Выполни первую миссию',
      icon: 'Seedling',
      unlocked: true
    },
    {
      id: 2,
      title: 'Хранитель воды',
      description: 'Сэкономь 1000 литров воды',
      icon: 'Droplet',
      unlocked: true
    },
    {
      id: 3,
      title: 'Воин переработки',
      description: 'Переработай 50 кг отходов',
      icon: 'Recycle',
      unlocked: true
    },
    {
      id: 4,
      title: 'Защитник лесов',
      description: 'Посади 5 деревьев',
      icon: 'TreePine',
      unlocked: false
    },
    {
      id: 5,
      title: 'Эко-мастер',
      description: 'Достигни 10 уровня',
      icon: 'Award',
      unlocked: false
    },
    {
      id: 6,
      title: 'Вдохновитель',
      description: 'Пригласи 10 друзей',
      icon: 'Users',
      unlocked: false
    }
  ]);

  const ecoFacts: EcoFact[] = [
    {
      id: 1,
      title: 'Пластик в океане',
      content: 'Каждый год в океан попадает около 8 миллионов тонн пластика. Это равно одному мусоровозу каждую минуту!',
      category: 'Океаны',
      icon: 'Waves'
    },
    {
      id: 2,
      title: 'Деревья и кислород',
      content: 'Одно дерево за год производит кислород для 2-3 человек и поглощает до 30 кг CO2.',
      category: 'Леса',
      icon: 'TreePine'
    },
    {
      id: 3,
      title: 'Переработка алюминия',
      content: 'Переработка одной алюминиевой банки экономит энергию, достаточную для работы телевизора 3 часа.',
      category: 'Переработка',
      icon: 'Recycle'
    },
    {
      id: 4,
      title: 'Водный след',
      content: 'Для производства одной пары джинсов требуется около 7500 литров воды. Покупай осознанно!',
      category: 'Вода',
      icon: 'Droplet'
    }
  ];

  const completeMission = (missionId: number) => {
    setMissions(missions.map(mission => {
      if (mission.id === missionId && mission.progress < 100) {
        const newProgress = Math.min(mission.progress + 25, 100);
        if (newProgress === 100) {
          setUserPoints(userPoints + mission.points);
          setLevelProgress(Math.min(levelProgress + 10, 100));
          return { ...mission, progress: newProgress, completed: true };
        }
        return { ...mission, progress: newProgress };
      }
      return mission;
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-amber-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Легко';
      case 'medium': return 'Средне';
      case 'hard': return 'Сложно';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('https://cdn.poehali.dev/projects/e5b36923-5495-417c-a5dd-5a767f433b53/files/3931bff9-0039-4725-9018-0cf4f3f9a86d.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
            <Icon name="Leaf" size={48} className="text-primary animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Эко-Миссия
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">Спасай планету через интерактивные челленджи!</p>
        </header>

        <Card className="mb-8 border-2 border-primary/20 shadow-lg animate-scale-in">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {userLevel}
                </div>
                <div>
                  <CardTitle className="text-2xl">Эко-герой</CardTitle>
                  <CardDescription className="text-lg">Уровень {userLevel} • {userPoints} очков</CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Icon name="Target" size={16} className="mr-2" />
                  {missions.filter(m => m.completed).length} / {missions.length} миссий
                </Badge>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Icon name="Award" size={16} className="mr-2" />
                  {achievements.filter(a => a.unlocked).length} / {achievements.length} наград
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>До уровня {userLevel + 1}</span>
                <span>{levelProgress}%</span>
              </div>
              <Progress value={levelProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="missions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-14 bg-card shadow-md">
            <TabsTrigger value="missions" className="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Target" size={20} className="mr-2" />
              Миссии
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Award" size={20} className="mr-2" />
              Достижения
            </TabsTrigger>
            <TabsTrigger value="learn" className="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="BookOpen" size={20} className="mr-2" />
              Обучение
            </TabsTrigger>
          </TabsList>

          <TabsContent value="missions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {missions.map((mission, index) => (
                <Card 
                  key={mission.id} 
                  className={`hover:shadow-xl transition-all duration-300 border-2 ${
                    mission.completed ? 'border-green-400 bg-green-50' : 'border-border hover:border-primary'
                  } animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-12 h-12 rounded-xl ${mission.completed ? 'bg-green-500' : 'bg-primary'} flex items-center justify-center text-white shadow-md`}>
                          <Icon name={mission.icon as any} size={24} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {mission.title}
                            {mission.completed && (
                              <Icon name="CheckCircle2" size={20} className="text-green-600" />
                            )}
                          </CardTitle>
                          <CardDescription className="text-sm">{mission.category}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${getDifficultyColor(mission.difficulty)} text-white`}>
                          {getDifficultyText(mission.difficulty)}
                        </Badge>
                        <Badge variant="outline" className="border-amber-500 text-amber-700">
                          <Icon name="Coins" size={14} className="mr-1" />
                          {mission.points}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{mission.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Прогресс</span>
                        <span>{mission.progress}%</span>
                      </div>
                      <Progress value={mission.progress} className="h-2" />
                    </div>

                    {!mission.completed && (
                      <Button 
                        onClick={() => completeMission(mission.id)}
                        className="w-full hover-scale"
                        disabled={mission.progress === 100}
                      >
                        {mission.progress === 100 ? (
                          <>
                            <Icon name="CheckCircle2" size={18} className="mr-2" />
                            Завершено!
                          </>
                        ) : (
                          <>
                            <Icon name="Play" size={18} className="mr-2" />
                            Продолжить
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <Card 
                  key={achievement.id}
                  className={`text-center hover:shadow-lg transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50' 
                      : 'opacity-60 grayscale'
                  } animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="mx-auto mb-3 relative">
                      <div 
                        className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl shadow-lg ${
                          achievement.unlocked 
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 animate-pulse' 
                            : 'bg-gray-400'
                        }`}
                      >
                        <Icon name={achievement.icon as any} size={40} />
                      </div>
                      {achievement.unlocked && (
                        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
                          <Icon name="Check" size={20} className="text-white" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {achievement.unlocked ? (
                      <Badge className="bg-green-500 text-white">
                        <Icon name="Unlock" size={14} className="mr-1" />
                        Получено
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-gray-400">
                        <Icon name="Lock" size={14} className="mr-1" />
                        Заблокировано
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8 border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader className="text-center">
                <div 
                  className="w-full h-48 mb-4 rounded-lg bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://cdn.poehali.dev/projects/e5b36923-5495-417c-a5dd-5a767f433b53/files/221b704c-9bb6-418d-bfa5-b2d78aa2a768.jpg')`
                  }}
                />
                <CardTitle className="text-2xl">Коллекционируй достижения!</CardTitle>
                <CardDescription className="text-base">
                  Выполняй миссии, помогай природе и открывай уникальные награды
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="learn" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ecoFacts.map((fact, index) => (
                <Card 
                  key={fact.id}
                  className="hover:shadow-lg transition-shadow border-2 border-blue-200 hover:border-blue-400 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white shadow-md">
                        <Icon name={fact.icon as any} size={24} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{fact.title}</CardTitle>
                        <CardDescription>{fact.category}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{fact.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8 border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="text-center">
                <div 
                  className="w-full h-64 mb-4 rounded-lg bg-cover bg-center shadow-lg"
                  style={{
                    backgroundImage: `url('https://cdn.poehali.dev/projects/e5b36923-5495-417c-a5dd-5a767f433b53/files/677c081a-dde4-4016-b8f8-6f3a83882b1d.jpg')`
                  }}
                />
                <CardTitle className="text-2xl">Узнавай больше об экологии</CardTitle>
                <CardDescription className="text-base">
                  Каждый день новые интересные факты о природе и защите окружающей среды
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button size="lg" className="hover-scale">
                  <Icon name="Sparkles" size={20} className="mr-2" />
                  Больше материалов
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8 border-2 border-primary bg-gradient-to-r from-green-100 to-blue-100">
          <CardContent className="py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 justify-center md:justify-start">
                  <Icon name="Users" size={28} className="text-primary" />
                  Пригласи друзей!
                </h3>
                <p className="text-muted-foreground text-lg">
                  Вместе вы сможете выполнять командные миссии и получать бонусы
                </p>
              </div>
              <Button size="lg" variant="default" className="hover-scale shadow-lg">
                <Icon name="Share2" size={20} className="mr-2" />
                Поделиться
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
