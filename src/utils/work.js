const {parentPort, workerData} = require("worker_threads");

const algorithm = require('./trans');

const sandbox = (code)=>{
    // 把象征的require替换成后端服务器路径
    const replacedCode = code.replace(/require\(['"](algorithm-visualizer)['"]\)/g, `require('${'./trans'}')`);
    eval(replacedCode)
}

const lines = workerData.code.split('\n').map((line, i) => line.replace(/(\.\s*delay\s*)\(\s*\)/g, `$1(${i})`));
const code = lines.join('\n');
try{
    sandbox(code)
}catch{
    parentPort.postMessage('err')
}
if(algorithm.Commander.commands.length) parentPort.postMessage(algorithm.Commander.commands)
else parentPort.postMessage(code)