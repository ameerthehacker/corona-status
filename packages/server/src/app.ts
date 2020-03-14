import express, { Request, Response } from 'express';
import morgan from 'morgan';
import { CovidAPIService } from './services/api/api';
import { HttpService } from './services/http/http';

const app = express();
const PORT = process.env.NODE_PORT || 3001;
// we will be fetching the data based on awesome pomber json
// https://pomber.github.io/covid19/timeseries.json
const httpService = new HttpService('https://pomber.github.io/covid19');
const covidAPIService = new CovidAPIService(httpService);

// setup request logging middleware
app.use(morgan('short'));
app.use(express.json());

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
