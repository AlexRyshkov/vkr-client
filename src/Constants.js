const defaultChartOptions = {
    scales: {
        xAxes: [
            {
                ticks: {autoSkip: false}
            }
        ]
    }
}

const filters = {
    departments: [],
    diagnoses: [],
    genders: {
        m: true,
        f: true
    },
    resultsNormal: {
        normal: true,
        aboveNormal: true,
        belowNormal: true
    },
    ageRange: [0, 100],
    dateRange: {
        startDate: new Date(2019, 1, 1).toISOString().slice(0, 10),
        endDate: new Date(2020, 1, 1).toISOString().slice(0, 10),
    }
}

const usedFilters = {
    departments: false,
    diagnoses: false,
    genders: true,
    resultsNormal: true,
    ageRange: true,
    dateRange: false,
}

module.exports = {defaultChartOptions, filters, usedFilters}