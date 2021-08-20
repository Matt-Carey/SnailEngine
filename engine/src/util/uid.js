const UID = (function () {
    var id = 1;
    return function () {
        return id++;
    }
})();

export { UID };
