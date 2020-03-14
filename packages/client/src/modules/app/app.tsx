import React, { useContext, useEffect, useState } from 'react';
import APIServiceContext from '../../contexts/api';
import { Stats } from '../../services/api/api';

export default function App() {
  const apiService = useContext(APIServiceContext);
  const [stats, setStats] = useState<Stats>();

  if (apiService === undefined) {
    throw new Error('`APIServiceContext is not provided in App`');
  }

  useEffect(() => {
    apiService.getStats('India').then((stats: Stats) => {
      setStats(stats);
    });
  }, [apiService]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>
        Corona Status{' '}
        <span role="img" aria-label="chart">
          📉
        </span>
      </h1>
      {!stats && <h1>Crunching Data...</h1>}
      {stats && (
        <div
          style={{
            marginTop: '50px'
          }}
        >
          <h1>
            <span role="img" aria-label="fire">
              🔥
            </span>{' '}
            New Cases: {stats.newCases}
          </h1>
          <h1>
            <span role="img" aria-label="sick">
              🤒
            </span>{' '}
            Active Cases: {stats.totalCases}
          </h1>
          <h1>
            <span role="img" aria-label="sick">
              😢
            </span>{' '}
            Total Deaths: {stats.totalDeaths}
          </h1>
          <h1>
            <span role="img" aria-label="dancer">
              💃
            </span>{' '}
            Total Recovered: {stats.totalRecovered}
          </h1>
        </div>
      )}
    </div>
  );
}
