export function getValue(obj, name) { //判断模板的绑定操作
    if (!obj) {
        return obj;
    }
    let nameList = name.split(".");
    let temp = obj;
    for (let i = 0; i < nameList.length; i++) {
        if (temp[nameList[i]]) {
            temp = temp[nameList[i]];
        } else {
            return undefined;
        }
    }
    return temp;
}

export function setValue(vm, attr, value) {
    if (!vm) {
        return;
    }
    let attrList = attr.split(".");
    let temp = vm;
    for (let i = 0; i < attrList.length - 1; i++) {
        if (temp[attrList[i]]) {
            temp = temp[attrList[i]];
        } else {
            return;
        }
        if (temp[attrList[attrList.length - 1]] != null) {
            temp[attrList[attrList.length - 1]] = value;
        }
    }
}