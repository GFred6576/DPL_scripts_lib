/**DPL_MenuLuncher 
 * @update
 * 1.0.0
 * 1.1.0
 * 1.1.2 调整scrollbar宽度
 */
(function () {
    var info = {
        name: 'DPL_MenuLuncher',
        version: '1.1.2',
        date: '2026.07.05',
        author: 'GFred',
        copyright: '©2026-' + (new Date()).getFullYear(),
        update: '1.0.0\n1.1.0 fix bug\n1.1.1 fix bug\n',
        about: ''
    };

    /**文件夹
     * 判断是否在Script文件夹或者Startup文件夹
     */
    var sptParentFolder = File($.fileName).parent;
    var sptParentFolderName = sptParentFolder.fsName;

    // var aeScriptUIFolder = new Folder("C:\\Program Files\\Adobe\\Adobe After Effects 2024\\Support Files\\Scripts\\ScriptUI Panels");
    var sptUIFolderPath,
        sptUIFolder;

    sptUIFolderPath = sptParentFolderName + "\\ScriptUI Panels";
    sptUIFolder = Folder(sptUIFolderPath);
    if (!sptUIFolder.exists) {
        //查找是否为Startup文件夹
        var thisFolder = sptParentFolderName;
        if (thisFolder.indexOf('\\Startup') == -1) {
            alert('folder path error! or this script is not installed in the "Script" of "Startup" folder!');
            return;
        }
        sptUIFolder = Folder(File($.fileName).parent.parent.fsName + "\\ScriptUI Panels");
    }

    /**配置 */
    if (app.settings.haveSetting(info.name, 'edText') == false) app.settings.saveSetting(info.name, 'edText', '');
    if (app.settings.haveSetting(info.name, 'sptSize') == false) app.settings.saveSetting(info.name, 'sptSize', '[300,300]');
    if (app.settings.haveSetting(info.name, 'collpase') == false) app.settings.saveSetting(info.name, 'collpase', false);
    if (app.settings.haveSetting(info.name, 'location') == false) app.settings.saveSetting(info.name, 'location', '[100,100]');
    if (app.settings.haveSetting(info.name, 'scrollVal') == false) app.settings.saveSetting(info.name, 'scrollVal', 0);

    /**UI */
    function UI_List() {
        var w = new Window('palette', info.name, [0, 0, 150, 150], {
            resizeable: true
        });
        w.orientation = 'row';
        w.alignment = ['fill', 'fill'];
        w.margins = w.spacing = 0;
        var g = w.add('group');
        g.orientation = 'column';
        g.alignment = ['fill', 'fill'];
        g.margins = g.spacing = 0;
        var gTop = g.add('group', [0, 0, 20, 20]);
        gTop.alignment = ['fill', 'top'];
        gTop.margins = 3;
        gTop.spacing = 0;
        var minBtn = gTop.add('customButton', [0, 0, 20, 20], undefined, { style: "toolbutton" });
        minBtn.text = 'M';
        minBtn.alignment = ['left', 'center'];
        var ed = gTop.add('edittext', [0, 0, 20, 20], '', { style: "toolbutton" });
        ed.alignment = ['fill', 'center'];
        ed.margins = ed.spacing = 0;
        var gBtns = g.add('group');
        gBtns.orientation = 'column';
        gBtns.alignment = ['fill', 'fill'];
        gBtns.margins = gBtns.spacing = 0;
        var gMsg = g.add('group', [0, 0, 15, 15]);
        gMsg.orientation = 'column';
        gMsg.alignment = ['fill', 'bottom'];
        gMsg.margins = gMsg.spacing = 0;
        var aboutStr = info.copyright + ' ' + info.author + ' v' + info.version + ' ';
        var msg = gMsg.add('statictext{justify:"center"}', undefined, aboutStr, { justify: 'center' });
        msg.text = aboutStr;
        msg.alignment = 'fill';
        msg.margins = msg.spacing = 0;

        var scroll = w.add('scrollbar', [0, 0, 15, 50], 0, 0, 500);
        scroll.alignment = ['right', 'fill'];
        scroll.stepdelta = 80;
        scroll.jumpdelta = 160;

        var btnSize = [150, 30];
        var minWinSize = 24;

        loadBtn();
        minBtn.onDraw = drawArrow;


        function getSpts(_folderObj) {
            var fd = _folderObj;
            if (!fd) { return; }
            var files = fd.getFiles();
            var names = [],
                fs = [],
                fds = [];
            for (var i = 0; i < files.length; i++) {
                names.push(decodeURIComponent(files[i].fsName));
                if (files[i] instanceof Folder) fds.push(files[i]);
                else {
                    if (files[i].name.match(/\.jsx(bin)?$/)) fs.push(files[i]);
                };
            }
            // print(files.length);
            // print(names.join('\n'));
            // print(fds.join('\n'));
            return fs;
        }
        function loadBtn() {
            try {
                var fd = sptUIFolder;
                if (!fd) {
                    alert('folder path error!');
                    return;
                }
                var fs = getSpts(fd);
                if (fs == [] || fs == null) return;
                if (gBtns.children.length > 0) {
                    for (var i = gBtns.children.length - 1; i >= 0; i--) { gBtns.remove(gBtns.children[i]); }
                }
                for (var i = 0; i < fs.length; i++) {
                    var fName = decodeURIComponent(fs[i].name);
                    var btn = gBtns.add('customButton', [0, 0, btnSize[0], btnSize[1]], undefined, { style: "toolbutton" });
                    btn.text = fName;
                    btn.index = i;
                    btn.alignment = ['fill', 'top'];
                    btn.onDraw = drawBtn;
                    btn.addEventListener('mouseover', function (e) { this.onDraw = function () { drawBtnHover.call(this); }; });
                    btn.addEventListener('mouseout', function (e) { this.onDraw = function () { drawBtn.call(this); }; });
                    function randVal() {
                        var val = Math.random();
                        if (val < .5) rand = .5;
                        return val;
                    }
                    function drawBtn() {
                        var g = this.graphics;
                        var pen1 = g.newPen(g.PenType.SOLID_COLOR, [1, 1, 1], 2);
                        var brush_corner = g.newBrush(g.BrushType.SOLID_COLOR, [.7, .8, .8, 1]);
                        var brush_bgCol1 = g.newBrush(g.BrushType.SOLID_COLOR, [.4, .5, .4, .3]);
                        var brush_bgCol2 = g.newBrush(g.BrushType.SOLID_COLOR, [.3, .3, .4, .3]);
                        g.rectPath(0, 0, this.size[0], this.size[1]);
                        g.rectPath(0, 0, this.size[0], this.size[1]);
                        this.index % 2 ? g.fillPath(brush_bgCol1) : g.fillPath(brush_bgCol2);
                        g.newPath();
                        g.moveTo(0, 0);
                        g.lineTo(3, 0);
                        g.lineTo(0, 3);
                        g.fillPath(brush_corner);
                        g.newPath();
                        g.drawString(this.text, pen1, 5, 3);
                    }
                    function drawBtnHover() {
                        var g = this.graphics;
                        var pen1 = g.newPen(g.PenType.SOLID_COLOR, [.8, 1, 1], 2);
                        var pen2 = g.newPen(g.PenType.SOLID_COLOR, [1, 1, .8], 2);
                        var brush1 = g.newBrush(g.BrushType.SOLID_COLOR, [.2, .3, .3, 1]);
                        g.newPath();
                        g.rectPath(0, 0, this.size[0], this.size[1]);
                        g.fillPath(brush1);
                        g.newPath();
                        g.moveTo(0, this.size[1]);
                        g.lineTo(this.size[0], this.size[1]);
                        g.strokePath(pen2);
                        g.newPath();
                        g.drawString(this.text, pen1, 5, 3);
                    }
                    btn.addEventListener('mousedown', function (e) {
                        var cmd = app.findMenuCommandId(this.text);
                        app.executeCommand(cmd);
                    });
                }
                //记录滑竿数值
                var scval = eval(app.settings.getSetting(info.name, 'scrollVal'));
                var s = gBtns.children.length * btnSize[1];
                scroll.maxvalue = s - btnSize[1];
                //恢复滑竿数值
                scroll.value = scval;
            } catch (e) { print(e.line + e.message); }
        }
        function collpasePanel() {
            var s = eval(app.settings.getSetting(info.name, 'sptSize'));
            w.size = (w.size[0] > 60 && w.size[1] > minWinSize) ? [minWinSize, minWinSize] : s;
            //判断是否折叠起来了
            var bol = (w.size[0] > 60 && w.size[1] > minWinSize) ? false : true;
            app.settings.saveSetting(info.name, 'collpase', bol);
            minBtn.onDraw = bol ? drawArrowCollpase : drawArrow;
            // print(bol);
        }
        function drawArrow() {
            var g = this.graphics;
            var brush1 = g.newBrush(g.BrushType.SOLID_COLOR, [.8, 1, 1, 1]);
            var center = [this.size[0] / 2, this.size[1] / 2];
            var dis = 10;
            g.newPath();
            g.moveTo(center[0] - dis / 2, center[1] - dis / 2);
            g.lineTo(center[0] + dis / 2, center[1] - dis / 2);
            g.lineTo(center[0], center[1] + dis / 2);
            g.fillPath(brush1);
        }
        function drawArrowCollpase() {
            var g = this.graphics;
            var brush1 = g.newBrush(g.BrushType.SOLID_COLOR, [1, 1, 1, 1]);
            var center = [this.size[0] / 2, this.size[1] / 2];
            var dis = 10;
            g.newPath();
            g.moveTo(center[0] - dis / 2, center[1] - dis / 2);
            g.lineTo(center[0] + dis / 2, center[1]);
            g.lineTo(center[0] - dis / 2, center[1] + dis / 2);
            g.fillPath(brush1);
        }

        minBtn.onClick = function () {
            collpasePanel();
            w.size[0] += 1; w.size[0] -= 1;
        };
        ed.addEventListener('mousedown', function (e) {
            if (e.button == 1) {
                this.text = '';
                this.notify('onChange');
                app.settings.saveSetting(info.name, 'edText', this.text);
            }
        });
        ed.onChange = ed.onChanging = function () {
            loadBtn();
            if (this.text == '') {
                w.size[0] += 1; w.size[0] -= 1;
                return;
            };
            var reg = /\+|\-|\*|\//g;
            var tArr = this.text.toLowerCase();
            for (var i = gBtns.children.length - 1; i >= 0; i--) {
                var btn = gBtns.children[i];  // 从后往前删除
                try {
                    //列表的文字去除特殊字符
                    var t = btn.text.toLowerCase().replace(/\_/g, ' ');
                    //搜索的文字分组
                    if (!t.match(eval('\/' + tArr.replace(/\,/g, '\|') + '\/g'))) gBtns.remove(btn);
                } catch (e) { continue; }
            }
            scroll.value = 0;
            scroll.notify('onChange');
            w.size[0] += 1; w.size[0] -= 1;
            app.settings.saveSetting(info.name, 'edText', this.text);
        };
        ed.addEventListener('mouseout', function (e) {
            this.active = false;
            gBtns.active = false;
            gBtns.active = true;
        });
        scroll.onChange = scroll.onChanging = function () {
            try {
                if (gBtns.children.length < 1) return;
                for (var i = 0; i < gBtns.children.length; i++) {
                    var btn = gBtns.children[i];
                    var s = gBtns.children.length * btnSize[1];
                    scroll.maxvalue = s - btnSize[1];
                    btn.location[1] = i * btnSize[1] - 1 * scroll.value;
                }
                app.settings.saveSetting(info.name, 'scrollVal', this.value);
            } catch (e) { }
        };
        w.onResize = function () {
            this.layout.resize();
            scroll.notify('onChange');
            var s = '[' + this.size.toString() + ']';
            var target = this.size[0] > 50 && this.size[1] > 50;
            if (target) app.settings.saveSetting(info.name, 'sptSize', s);

            scroll.size[0] = target ? 15 : 0;
        };
        w.addEventListener('mouseover', function () {
            // print(w.location);
            var s = '[' + w.location.toString() + ']';
            app.settings.saveSetting(info.name, 'location', s);
            msg.text = aboutStr + s;
        });
        w.layout.layout(true);
        w.show();
        var coll = eval(app.settings.getSetting(info.name, 'collpase'));
        w.size = eval(app.settings.getSetting(info.name, 'sptSize'));
        w.location = eval(app.settings.getSetting(info.name, 'location'));

        ed.text = app.settings.getSetting(info.name, 'edText');
        if (ed.text != '') ed.notify('onChange');
        if (coll) minBtn.onClick();
        scroll.value = eval(app.settings.getSetting(info.name, 'scrollVal'));
    }
    /**$.writeln输出内容
     * @param {*} _str 
     */
    function print(_str) {
        $.writeln(_str);
    }
    UI_List();
})();