import './App.css';
import TradingChart from './components/TradingChart';
import data from './data.json';
import { useState } from 'react';

function App() {
  const [period, setPeriod] = useState('MAX');
  
  const periods = ['1D', '1W', '1M', '3M', '6M', '12M', '3Y', '5Y', 'YTD', 'MAX'];

  return (
    <div>
      <div className="period-buttons">
        {periods.map(p => (
          <button 
            key={p}
            onClick={() => setPeriod(p)}
            className={period === p ? 'active' : ''}
          >
            {p}
          </button>
        ))}
      </div>
      <TradingChart chartData={data} period={period} />
    </div>
  );
}

export default App;
