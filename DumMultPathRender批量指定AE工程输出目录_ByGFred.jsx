/**
 * 批量输出-匹配名字
 *  OutPutModule可以全选、然后套用预设，此脚本仅用于批量替换输出路径
 * @author  GFred
 */
(function () {
    var f = new Folder().openDlg();
    var que = app.project.renderQueue;
    //获取前面路径
    f = String(File.decode(f));
    f = f.substr(0, f.lastIndexOf('/') + 1);
    for (i = 1; i <= app.project.renderQueue.numItems; i++) {
        que.item(i).outputModule(1).file = new File(f + que.item(i).comp.name)
    }
})()
//