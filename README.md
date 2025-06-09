# PS5 Launcher & Shell

Лаунчер и интерфейс в стиле PlayStation 5 для управления играми. На данный момент поддерживает запуск лаунчера и отображение оболочки PS5. Проект разработан с использованием React, Tailwind CSS и Electron.


![prew](https://github.com/user-attachments/assets/d87e04dd-0135-4304-927d-b3f33a71b131)


## Скачать готовую версию
[Скачать для Windows](https://github.com/DarkVazer/PS5-Launcher-Shell/releases/tag/latest)

## Возможности
- Интерфейс в стиле PS5 с плавной навигацией и анимациями (например, tile-glow, градиентные границы).
- Поддержка запуска лаунчера через Electron.
- Навигация по разделам (header, game-tiles, must-see-tiles) с помощью клавиш или кликов.
- Отображение времени и статуса пользователя в шапке.
- Видео-фон для улучшенного визуального опыта.

## Ограничения
- Добавление и запуск игр пока не поддерживаются.
- Проект находится в активной разработке, возможны изменения в функционале.

## Технологии
- **Frontend**: React, Tailwind CSS
- **Backend**: Electron (для десктопного приложения)
- **Управление состоянием**: Zustand
- **Анимации**: CSS (tile-glow, gradient borders), SVG
- **Видео**: WebM (фоновое видео)

## Установка
1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/DarkVazer/PS5-Launcher-Shell.git
   ```
2. Перейдите в папку проекта:
   ```bash
   cd PS5-Launcher-Shell
   ```
3. Установите зависимости:
   ```bash
   npm install
   ```
4. Запустите приложение:
   ```bash
   npm start
   ```

## Использование
- **Навигация**: Используйте стрелки на клавиатуре (вверх, вниз, влево, вправо) или клики мышью или геймпад для переключения между разделами (шапка, игровые плитки, must-see).
- **Запуск оболочки**: Нажмите кнопку "Launch PS5 Shell" в лаунчере для запуска интерфейса PS5.
- **Ограничения**: На текущий момент добавление игр через интерфейс лаунчера не поддерживается.

## Структура проекта
```
PS5-Launcher-Shell/
├── src/
│   ├── assets/...
│   ├── components/
│   │   ├── GameTiles.jsx
│   │   ├── Header.jsx
│   │   ├── MustSeeSection.jsx
│   │   └── TileWaveEffect.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── Launcher.jsx
│   ├── LauncherApp.jsx
│   ├── main.jsx
│   └── store.js
├── public/
│   └── assets/
│       ├── LoopNoParticles.webm
│       ├── Store.svg
│       ├── Explorer.svg
│       └── ...
├── electron/
│   ├── main-launcher.js
│   ├── main.js
│   └── preload.js
├── launcher.html
├── index.html
├── .gitignore
├── LICENSE
├── README.md
└── package.json
```

## Как внести вклад
1. Форкните репозиторий.
2. Создайте новую ветку:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Внесите изменения и закоммитьте:
   ```bash
   git commit -m "Add some feature"
   ```
4. Запушьте в ветку:
   ```bash
   git push origin feature/YourFeature
   ```
5. Создайте Pull Request на GitHub.

## Требования к разработке
- Node.js (v16 или выше)
- npm или yarn
- Electron (для десктопного приложения)
- Совместимость с современными браузерами (для React-компонентов)

## Планы на будущее
- Добавить поддержку запуска игр через лаунчер.
- Расширить функционал must-see секции (например, отображение трейлеров).
- Оптимизировать производительность анимаций.
- Добавить настройки пользователя (например, смена темы).

## Лицензия
[MIT License](LICENSE)

## Контакты
Если у вас есть вопросы или предложения, создайте issue в репозитории или свяжитесь с автором через GitHub.
