import moment from "moment";

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+[^\s@]+$/;
    return regex.test(email);
}

export const getInitials = (name) => {
    if (!name) return "";

    const words = name.split(" ");
    let initials = "";

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0];
    }

    return initials.toUpperCase();
};

export const addThousandsSeparator = (num) => {
    if (num == null || isNaN(num)) return "";

    const [integerPart, fractionalPart] = num.toString().split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    return fractionalPart
        ? `${formattedInteger}.${fractionalPart}`
        : formattedInteger;
}

export const prepareExpenseBarChartData = (data = []) => {
    const chartData = data.map((item) => ({
        category: item?.category,
        amount: item?.amount
    }))

    return chartData;
}

export const prepareIncomeBarChartData = (data = []) => {
    if (!Array.isArray(data) || data.length === 0) {
        return [];
    }

    const storedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = storedData.map((item) => ({
        month: moment(item?.date).format("MM YYYY"),
        amount: item?.amount,
        source: item?.source
    }));

    return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
    if (!Array.isArray(data) || data.length === 0) {
        return [];
    }

    const storedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = storedData.map((item) => ({
        month: moment(item?.date).format("DD MMM YYYY"),
        amount: item?.amount,
        category: item?.category
    }));

    return chartData;

}