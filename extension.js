const vscode = require('vscode');
const { readContent, parseContent, createGameHtml } = require('./handlers/index')


function activate(context) {
	let disposable = vscode.commands.registerCommand('text-game-maker.build', function (params) {
    const path = params.fsPath;
    const content = readContent(path);
    const unitList = parseContent(content);
    if(!unitList.length) {
      vscode.window.showErrorMessage('没有待打包的游戏内容');
      return;
    }
    createGameHtml(JSON.stringify(unitList).replace(/\\[bn]/g,""), path);
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
