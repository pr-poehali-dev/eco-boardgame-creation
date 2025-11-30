import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export interface Territory {
  id: number;
  name: string;
  pollution: number;
  greenery: number;
  owner: string | null;
  type: 'lake' | 'polluted-lake' | 'park' | 'forest-edge' | 'forest' | 'industrial' | 'field' | 'ravine';
}

export interface GameAction {
  type: 'clean' | 'plant' | 'build';
  name: string;
  materialsCost: number;
  foodCost: number;
  waterCost: number;
  energyCost: number;
  effect: string;
  icon: string;
}

interface TerritoryMapProps {
  territories: Territory[];
  selectedTerritory: number | null;
  setSelectedTerritory: (id: number | null) => void;
  gameActions: GameAction[];
  canPerformAction: (action: GameAction) => boolean;
  performAction: (action: GameAction, territoryId: number) => void;
}

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

export default function TerritoryMap({
  territories,
  selectedTerritory,
  setSelectedTerritory,
  gameActions,
  canPerformAction,
  performAction
}: TerritoryMapProps) {
  return (
    <>
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
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
