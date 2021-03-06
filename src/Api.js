import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL

export function getDepartments() {
    return axios.get(SERVER_URL + '/api/departments');
}

export function getTests() {
    return axios.get(SERVER_URL + '/api/tests');
}

export function getMkb() {
    return axios.get(SERVER_URL + '/api/mkb');
}

export function getDiagnoses() {
    return axios.get(SERVER_URL + '/api/diagnoses');
}

export function getPatients() {
    return axios.get(SERVER_URL + '/api/patients');
}

export function getPatient(id) {
    return axios.get(SERVER_URL + `/api/patients/${id}`);
}

export function getBoxplotData(chartOptions, cancellationToken) {
    try {
        return axios.post(SERVER_URL + '/api/boxplot',
            chartOptions,
            {
                cancelToken: cancellationToken
            });
    } catch (e) {
        if (axios.isCancel(e)) {
            return e;
        }
    }
}

export async function getSplomData(scatterplotOptions, cancellationToken) {
    try {
        return axios.post(SERVER_URL + '/api/splom',
            scatterplotOptions,
            {
                timeout: 180000,
                cancelToken: cancellationToken
            });
    } catch (e) {
        if (axios.isCancel(e)) {
            return e;
        }
    }
}

export async function getCorrelationData(correlationOptions, cancellationToken) {
    try {
        return axios.post(SERVER_URL + '/api/correlation',
            correlationOptions,
            {
                timeout: 180000,
                cancelToken: cancellationToken
            });
    } catch (e) {
        if (axios.isCancel(e)) {
            return e;
        }
    }
}

export async function getHistogramData(histogramOptions, cancellationToken) {
    try {
        return axios.post(SERVER_URL + '/api/histogram',
            histogramOptions,
            {
                timeout: 180000,
                cancelToken: cancellationToken
            });
    } catch (e) {
        if (axios.isCancel(e)) {
            return e;
        }
    }
}

export async function getClusterData(clusterOptions, cancellationToken) {
    try {
        return axios.post(SERVER_URL + '/api/cluster',
            clusterOptions,
            {
                timeout: 180000,
                cancelToken: cancellationToken
            });
    } catch (e) {
        if (axios.isCancel(e)) {
            return e;
        }
    }
}

export async function getSamplesResultsTableData(options, cancellationToken) {
    try {
        return axios.post(SERVER_URL + '/api/tables/samples-results',
            options,
            {
                timeout: 180000,
                cancelToken: cancellationToken
            });
    } catch (e) {
        if (axios.isCancel(e)) {
            return e;
        }
    }
}

export async function downloadSamplesResultsTable(options, cancellationToken) {
    try {
        const response = await axios.post(SERVER_URL + '/api/tables/samplesresults/download',
            options,
            {
                timeout: 180000,
                cancelToken: cancellationToken,
                responseType: "blob",
                headers: {
                    'Accept': 'application/octet-stream',
                }
            });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'stats.docx'); //or any other extension
        document.body.appendChild(link);
        link.click();
    } catch (e) {
        if (axios.isCancel(e)) {
            return e;
        }
    }
}