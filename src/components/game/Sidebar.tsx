import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Territory } from './TerritoryMap';

export interface Competitor {
  id: number;
  name: string;
  color: string;
  score: number;
  territories: number;
  avatar: string;
}

interface SidebarProps {
  competitors: Competitor[];
  playerScore: number;
  territories: Territory[];
  currentRound: number;
}

export default function Sidebar({ competitors, playerScore, territories, currentRound }: SidebarProps) {
  const allCompetitors = [
    { name: 'Вы', score: playerScore, territories: territories.filter(t => t.owner === 'Вы').length, color: 'bg-green-500', avatar: '🎯' },
    ...competitors
  ].sort((a, b) => b.score - a.score);

  return (
    <>
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
    </>
  );
}
