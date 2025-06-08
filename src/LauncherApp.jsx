// LauncherApp.jsx
import { createRoot } from 'react-dom/client';
import Launcher from './Launcher.jsx';
import './App.css'; // Подключаем Tailwind и кастомные стили

createRoot(document.getElementById('launcher-root')).render(<Launcher />);
