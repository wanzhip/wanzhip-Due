import {
    getValue
} from "../util/ObjectUtil.js";

//通过模板，找节点  通过节点找模板
let template2Vnode = new Map();
let vnode2Template = new Map();

export function renderMixin(Due) {
    Due.prototype._render = function () {
        renderNode(this, this._vnode);
    };
};

export function renderData(vm, data) {
    let vnodes = template2Vnode.get(data);
    if (vnodes != null) {
        for (let i = 0; i < vnodes.length; i++) {
            renderNode(vm, vnodes[i]);
        }
    }
}

export function renderNode(vm, vnode) {
    if (vnode.nodeType == 3) {
        let templates = vnode2Template.get(vnode); //此处拿到的是数组
        if (templates) {
            let result = vnode.text;
            for (let i = 0; i < templates.length; i++) {
                let templateValue = getTemplateValue([vm._data, vnode.env], templates[i]);
                if (templateValue) {
                    result = result.replace("{{" + templates[i] + "}}", templateValue);
                }
            }
            vnode.ele.nodeValue = result;
        }
    } else if (vnode.nodeType == 1 && vnode.tag == "INPUT") {
        let templates = vnode2Template.get(vnode);
        if (templates) {
            for (let i = 0; i < templates.length; i++) {
                let templateValue = getTemplateValue([vm._data, vnode.env], templates[i]);
                if (templateValue) {
                    vnode.ele.value = templateValue;
                }
            }
        }
    } else {
        for (let i = 0; i < vnode.children.length; i++) {
            renderNode(vm, vnode.children[i]);

        }
    }
};

function getTemplateValue(objs, templateName) {
    for (let i = 0; i < objs.length; i++) {
        let temp = getValue(objs[i], templateName);
        if (temp != null) {
            return temp;
        }
    }
};

export function prepareRender(vm, vnode) {
    if (vnode == null) {
        return;
    };
    if (vnode.nodeType == 3) {
        analysisTeplateString(vnode);
    };
    analysisAttr(vm, vnode);
    if (vnode.nodeType == 1) {
        for (let i = 0; i < vnode.children.length; i++) {
            //遍历
            prepareRender(vm, vnode.children[i]);
        }
    }
};

//分析文本
function analysisTeplateString(vnode) {
    let templateString = vnode.text.match(/{{[a-zA-Z0-9_.]+}}/g);
    for (let i = 0; templateString && i < templateString.length; i++) {
        setTemplate2Vnode(templateString[i], vnode);
        setVnode2Template(templateString[i], vnode);
    }

};

//模板到节点映射
function setTemplate2Vnode(template, vnode) {
    let templateName = getTemplateName(template);
    let vnodeSet = template2Vnode.get(templateName);
    if (vnodeSet) {
        vnodeSet.push(vnode);
    } else {
        template2Vnode.set(templateName, [vnode]);
    }

};

//节点到模板映射
function setVnode2Template(template, vnode) {
    let templateSet = vnode2Template.get(vnode);
    if (templateSet) {
        templateSet.push(getTemplateName(template))
    } else {
        vnode2Template.set(vnode, [getTemplateName(template)]);
    }
};


//有模板去除模板
function getTemplateName(template) {
    if (template.substring(0, 2) == "{{" && template.substring(template.length - 2, template.length) == "}}") {
        return template.substring(2, template.length - 2);
    } else {
        return template;
    }
}


function analysisAttr(vm, vnode) {
    if (vnode.nodeType != 1) {
        return;
    }
    let attrName = vnode.ele.getAttributeNames();
    if (attrName.indexOf("v-model") > -1) {
        setTemplate2Vnode(vnode.ele.getAttribute("v-model"), vnode);
        setVnode2Template(vnode.ele.getAttribute("v-model"), vnode);
    }

};
export function getTemplate2VnodeMap() {
    return template2Vnode;
};
export function getVnode2TemplateMap() {
    return vnode2Template;
};