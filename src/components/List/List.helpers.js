function checkPopulationProps(populationProp, population) {
  if (populationProp === 'per 100.000 population') {
    return 100000 / population;
  }
  return 1;
}

function checkTime(time, TotalConfirmed, NewConfirmed) {
  return time === 'all time' ? TotalConfirmed : NewConfirmed;
}

function getParametrs(parametr, data) {
  if (parametr === 'confirmed') {
    return {
      new: data.NewConfirmed,
      total: data.TotalConfirmed
    }
  } if (parametr === 'death') {
    return {
      new: data.NewDeaths,
      total: data.TotalDeaths
    }
  } 
    return {
      new: data.NewRecovered,
      total: data.TotalRecovered
    }
}

export {checkPopulationProps, checkTime, getParametrs};
