function getPopulation(dataPopulation, country) {
  if (country.Country === 'World') {
    return dataPopulation.reduce((population, _country) => population + _country.population, 0);
  } 
  
  return dataPopulation.find((_country) => _country.name === country.Country).population;
}

function getCasesPer100th(cases, population) {
  const perPopulation = 100000;
  return Math.round(cases * perPopulation / population);
}

export { getPopulation, getCasesPer100th };
