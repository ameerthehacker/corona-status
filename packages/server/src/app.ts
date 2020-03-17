import express, { Request, Response } from 'express';
import morgan from 'morgan';
import { CovidAPIService } from './services/api/api';
import { HttpService } from './services/http/http';
import cors, { CorsOptions } from 'cors';
import { IndianStateAPIService } from './services/state-api/india';
import { StateAPIService } from './services/contracts/state-api';

const app = express();
const PORT = process.env.PORT || 3001;
// we will be fetching the data based on awesome pomber json
// https://pomber.github.io/covid19/timeseries.json
const countryHttpService = new HttpService('https://pomber.github.io/covid19');
const indianStateHttpService = new HttpService(
  'https://ameerthehacker.github.io/corona-india-status'
);

// state API services
const indianStateAPIService: StateAPIService = new IndianStateAPIService(
  indianStateHttpService
);
const covidAPIService = new CovidAPIService(countryHttpService, [
  indianStateAPIService
]);

const whitelist: string[] = [];

if (process.env.NODE_ENV === 'development') {
  console.log('express server is running in development mode 🔨');

  whitelist.push('http://localhost:3000');
}

if (process.env.NODE_ENV === 'production') {
  const clientDomain = process.env.CLIENT_DOMAIN;

  if (clientDomain) {
    whitelist.push(...clientDomain.split(','));
  }

  console.log('express server is running in production mode 🔥');
}

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin || '') !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// setup request logging middleware
app.use(morgan('short'));
app.use(express.json());
// setup cors policy middleware
app.use(cors(corsOptions));

const dataRouter = express.Router();

// this route must come first
dataRouter.get('/countries', async (req: Request, res: Response) => {
  await covidAPIService.fetchData();
  const countries = covidAPIService.getAvailableCountries();

  res.json({
    countries
  });
});

dataRouter.get('/:country', async (req: Request, res: Response) => {
  const country = req.params.country;
  const date = req.query.date;
  await covidAPIService.fetchData();

  if (covidAPIService.isDataAvailableForCountry(country)) {
    const response = {
      totalCases: covidAPIService.getTotalCases(date, country),
      newCases: covidAPIService.getNewCases(date, country),
      activeCases: covidAPIService.getActiveCases(date, country),
      totalDeaths: covidAPIService.getTotalDeaths(date, country),
      totalRecovered: covidAPIService.getTotalRecovered(date, country)
    };

    res.json(response);
  } else {
    res.sendStatus(404);
  }
});

app.use('/api/data', dataRouter);

app.listen(PORT, () => {
  console.log(`🚀 express server running at port ${PORT}`);
});
