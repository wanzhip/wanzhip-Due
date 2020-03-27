import VNode from "../../vnode/vnode.js";
import {
    getValue
} from "../../util/ObjectUtil.js";
export function vforInit(vm, ele, parent, instructions) { //instructions 存放指令内容
    //tag, ele, children, text, data, parent, nodeType
    let virtualNode = new VNode(ele.nodeName, ele, [], "", getVirtualNodeData(instructions)[2], parent, 0);
    parent.ele.removeChild(ele);
    parent.ele.appendChild(document.createTextNode(""));
    let resultSet = analysisInstrutions(vm, instructions, ele, parent);
    return virtualNode;
};

//拿指令对应的内容
function getVirtualNodeData(instructions) {
    console.log(instructions);
    let inSet = instructions.trim().split(" ");
    if (inSet.length != 3 || inSet[1] != "in" && inSet[1] != "of") {
        throw new Error("error");
    }
    return inSet;
};

//分析指令
function analysisInstrutions(vm, instructions, ele, parent) {
    let inSet = getVirtualNodeData(instructions);
    console.log(inSet, '1515');
    //拿指令对应的list
    let dataSet = getValue(vm._data, inSet[2]);
    if (!dataSet) {
        throw new Error("error");
    }
    let resultSet = [];
    //list有值,循环list中的值创建dom
    for (let i = 0; i < dataSet.length; i++) {
        let tempDom = document.createElement(ele.nodeName);
        tempDom.innerHTML = ele.innerHTML;
        let env = analysisKV(inSet[0], dataSet[i], i);
        tempDom.setAttribute("env", JSON.stringify(env));
        parent.ele.appendChild(tempDom);
        resultSet.push(tempDom);
    }
    return resultSet;
};

function analysisKV(instructions, value, index) {
    //处理带括号匹配(value,index) in list
    if (/([a-zA-Z0-9_$]+)/.test(instructions)) {
        instructions = instructions.trim();
        instructions = instructions.substring(1, instructions.length - 1);
    }
    let keys = instructions.split(",");
    let obj = {};
    if (keys.length == 0) {
        throw new Error("error");
    } else if (keys.length == 1) { //(value)
        obj[keys[0].trim()] = value;
    } else if (keys.length >= 2) { //(value,index)
        obj[keys[1].trim()] = index;
    }
    return obj;
}