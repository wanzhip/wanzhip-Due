import {
    setValue
} from "../../util/ObjectUtil.js"

export function vmodel(vm, ele, data) {
    ele.onchange = function (event) {
        setValue(vm._data, data, ele.value);
        //data是绑定的属性aaa.m  ele.value 是标签节点对应的value
    }
}