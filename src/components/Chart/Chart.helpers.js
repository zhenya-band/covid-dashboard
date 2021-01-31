function getSlugCountry(countries, countryCode) {
  return countries.find((country) => country.ISO2 === countryCode).Slug;
}

function getDates(dayOneData) {
  return dayOneData.map((dayData) => new Date(dayData.Date).toLocaleDateString());
}

function getCases(dayOneData, cases) {
  let currentCases = '';

  if (cases === 'deaths') {
    currentCases = 'Deaths';
  } else if (cases === 'recovered') {
    currentCases = 'Recovered';
  } else {
    currentCases = 'Confirmed';
  }

  return dayOneData.map((dayData) => dayData[currentCases]);
}

function getWorldDates(dayOneWorldData) {
  return dayOneWorldData.map((dayData) => new Date(dayData.last_update).toLocaleDateString());
}

function getWorldCases(dayOneWorldData, cases) {
  let currentCases = '';

  if (cases === 'deaths') {
    currentCases = 'total_deaths';
  } else if (cases === 'recovered') {
    currentCases = 'total_recovered';
  } else {
    currentCases = 'total_cases';
  }

  return dayOneWorldData.map((dayData) => dayData[currentCases]);
}

function getDailyCases(cases) {
  return cases.map((currentCase, index, allCases) => {
    if (index === 0) return currentCase;
    const dayCases = currentCase - allCases[index - 1];
    return dayCases > 0 ? dayCases : 0;
  });
}

function getCasesPer100th(casesData, population) {
  const perPopulation = 100000;
  return casesData.map((cases) => Math.floor(cases * perPopulation / population));
}

export { getSlugCountry, getDates, getCases, getWorldDates, getWorldCases, getDailyCases, getCasesPer100th };
