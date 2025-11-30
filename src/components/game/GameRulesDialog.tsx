import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface GameRulesDialogProps {
  showIntro: boolean;
  setShowIntro: (show: boolean) => void;
  startGame: () => void;
}

export default function GameRulesDialog({ showIntro, setShowIntro, startGame }: GameRulesDialogProps) {
  return (
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
  );
}
