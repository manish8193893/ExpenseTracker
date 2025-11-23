export const BASE_URL = 'https://expensetracker-production-a71f.up.railway.app/';
// export const BASE_URL = 'http://localhost:8000/';

// utils/apiPaths.js
export const API_PATHS = {
    AUTH: {
        LOGIN: `api/v1/auth/login`,
        REGISTER: `api/v1/auth/register`,
        GET_USER_INFO: `api/v1/auth/getUser`,
    },
    INCOME: {
        ADD_INCOME: `api/v1/income/add`,
        GET_ALL_INCOMES: `api/v1/income/get`,
        DELETE_INCOME: (id) => `api/v1/income/${id}`,
        DOWNLOAD_INCOME: (id) => `api/v1/income/downloadexcel`,
    },
    EXPENSE: {
        ADD_EXPENSE: `api/v1/expense/add`,
        GET_EXPENSES: `api/v1/expense/get`,
        DELETE_EXPENSE: (id) => `api/v1/expense/${id}`,
        DOWNLOAD_EXPENSE: (id) => `api/v1/expense/downloadexcel`,
    },
    DASHBOARD: {
        GET_DASHBOARD_DATA: `api/v1/dashboard`,
    },
    IMAGE:{
        UPLOAD_IMAGE: `api/v1/auth/upload-image`,
    }
};