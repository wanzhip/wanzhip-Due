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