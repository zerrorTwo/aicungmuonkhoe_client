import { Button, DatePicker } from 'antd';
import './App.css'
import 'antd/dist/reset.css'

function App() {
  return (
    <div className="p-8 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">🚀 Ant Design + Tailwind + Vite</h1>
      <Button type="primary">Primary Button</Button>
      <DatePicker />
    </div>
  );
}

export default App;
