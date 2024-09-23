const asyncFunctionHandler = (fn) => {
    return (...args) => {
        return Promise.resolve(fn(...args)).catch((error) => {
            console.error('Xatolik yuz berdi:', error);
            throw error; // Xatolikni yuqoriga otkazadi
        });
    };
};

module.exports = asyncFunctionHandler;
