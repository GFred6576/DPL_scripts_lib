(function (_obj) {
    var fileName = 'DPL_MenuLuncher.jsx';
    var file = File(File($.fileName).parent.parent.fsName + '\\' + fileName);
    if (!file.exists) {
        alert('not find ' + fileName);
        return;
    };
    file.open('r');
    eval(file.read());
    file.close();
})(this);
