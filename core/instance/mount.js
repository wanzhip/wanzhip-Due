import VNode from "../vnode/vnode.js";
import {
    prepareRender,
    getTemplate2VnodeMap,
    getVnode2TemplateMap
} from "./render.js";

export function initMount(Due) {
    Due.prototype.$mount = function (el) {
        let vm = this;
        let rootDom = document.getElementById(el);
        mount(vm, rootDom);
    }
}

export function mount(vm, el) {
    console.log("begin mount", el);
    //进行挂载 虚拟dom根节点
    vm._vnode = constructVNode(vm, el, null);
    //预备渲染，建立渲染索引   模板和vnode形成映射关系
    prepareRender(vm, vm._vnode);
    console.log(getTemplate2VnodeMap());
    console.log(getVnode2TemplateMap());
}

function constructVNode(vm, ele, parent) {
    //深度优先搜索
    let vnode = null;
    let children = [];
    let text = getNodeText(ele); //文本  只有#TEXT节点有文本  其他叫文本子节点
    let data = null;
    let nodeType = ele.nodeType;
    let tag = ele.nodeName;
    vnode = new VNode(tag, ele, children, text, data, parent, nodeType);
    console.log(parent, vnode, "66")
    let childs = vnode.ele.childNodes;
    console.log(childs, 555)
    for (let i = 0; i < childs.length; i++) {
        let childNodes = constructVNode(vm, childs[i], vnode);
        if (childNodes instanceof VNode) {
            //返回单一节点
            vnode.children.push(childNodes);
        } else {
            //返回节点数组
            vnode.children = vnode.children.concat(childNodes);
        }
    }
    return vnode;
}

//获取#TEXT节点文本
function getNodeText(ele) {
    if (ele.nodeType == 3) {
        return ele.nodeValue;
    } else {
        return "";
    }
}