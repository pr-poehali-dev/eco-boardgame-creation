import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export interface ResourceCard {
  id: string;
  type: 'materials' | 'food' | 'water' | 'energy';
  value: 5 | 10 | 20;
}

interface ResourceManagementProps {
  playerCurrency: number;
  resourceCards: ResourceCard[];
  buyResourceCard: (type: ResourceCard['type']) => void;
  sellResourceCard: (cardId: string) => void;
  getTotalResourceValue: (type: ResourceCard['type']) => number;
}

export default function ResourceManagement({
  playerCurrency,
  resourceCards,
  buyResourceCard,
  sellResourceCard,
  getTotalResourceValue
}: ResourceManagementProps) {
  return (
    <>
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
    </>
  );
}
