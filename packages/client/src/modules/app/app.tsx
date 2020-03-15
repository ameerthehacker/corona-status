import React, { useContext, useEffect, useState } from 'react';
import APIServiceContext from '../../contexts/api';
import { Stats } from '../../services/api/api';
import CountryInput from '../../components/country-input/country-input';
import Emoji from '../../components/emoji/emoji';

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
      <CountryInput countries={['India', 'Indiana', 'Australia']} />
      {!stats && <h1>Crunching Data...</h1>}
      {stats && (
        <div
          style={{
            marginTop: '50px'
          }}
        >
          <h1>
            <Emoji emoji={'🔥'} ariaLabel={'fire'} /> New Cases:{' '}
            {stats.newCases}
          </h1>
          <h1>
            <Emoji emoji={'🤒'} ariaLabel={'sick'} /> Active Cases:{' '}
            {stats.totalCases}
          </h1>
          <h1>
            <Emoji emoji={'😢'} ariaLabel={'cry'} /> Total Deaths:{' '}
            {stats.totalDeaths}
          </h1>
          <h1>
            <Emoji emoji={'💃'} ariaLabel={'dancer'} /> Total Recovered:{' '}
            {stats.totalRecovered}
          </h1>
        </div>
      )}
    </div>
  );
}
