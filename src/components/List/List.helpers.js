function checkPopulationProps(populationProp, population) {
  if (populationProp === 'per 100.000 population') {
    return 100000 / population;
  }
  return 1;
}

function checkTime(time, total, lastDay) {
  return time === 'all time' ? total : lastDay;
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

function getParametrsByCountry(parameter, NewConfirmed, TotalConfirmed, NewDeaths, TotalDeaths, NewRecovered, TotalRecovered) {
  if (parameter === 'confirmed') {
    return {
      new: NewConfirmed,
      total: TotalConfirmed
    }
  } if (parameter === 'death') {
    return {
      new: NewDeaths,
      total: TotalDeaths
    }
  } 
    return {
      new: NewRecovered,
      total: TotalRecovered
    }
}

export {checkPopulationProps, checkTime, getParametrs, getParametrsByCountry};
