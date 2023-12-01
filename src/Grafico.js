import { useEffect, useState } from "react";
import './Grafico.css';
import { AreaChart, XAxis, YAxis, CartesianGrid, Area, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';

function Grafico(props) {
    
  /*
  //Verificare la possibilità di usare il seguente codice
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);
    window.addEventListener('DOMContentLoaded', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('DOMContentLoaded', handleResize);
    }
  }, []);
  */

  return (
    <div className="grafico">
        <ResponsiveContainer>
          <AreaChart
            data={props.datistock}            
            margin={{ top: 45, right: 40, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="datetime" />
            <YAxis domain={[
              dataMin => ((dataMin-dataMin*2/100).toFixed(2)),
              dataMax => ((dataMax+dataMax*2/100).toFixed(2))
            ]}/>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />            
            <Area type="monotone" dataKey="price" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
          </AreaChart>
        </ResponsiveContainer>    
    </div>
  )
}
export default Grafico;
