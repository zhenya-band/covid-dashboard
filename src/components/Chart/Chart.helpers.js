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

function getCasesPer100th(casesData, population) {
  const perPopulation = 100000;
  return casesData.map((cases) => Math.floor(cases * perPopulation / population));
}

export { getSlugCountry, getDates, getCases, getCasesPer100th };
