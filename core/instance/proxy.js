//vm表示Due对象,obj表示要代理的对象,namespace

import {
    renderData
} from "./render.js";

//监听属性变化
export function constructProxy(vm, obj, namespace) {
    let proxyObj = null;
    if (obj instanceof Array) {
        //对象是否是数组
        proxyObj = new Array(obj.length);
        for (let i = 0; i < obj.length; i++) {
            proxyObj[i] = constructProxy(vm, obj[i], namespace);
        };
        proxyObj = proxyArr(vm, obj, namespace); //数组代理
    } else if (obj instanceof Object) {
        //是否为对象
        proxyObj = constructObjProxy(vm, obj, namespace); //对象代理
    } else {
        throw new Error("error");
    }
    return proxyObj;
};

//对象代理
function constructObjProxy(vm, obj, namespace) {
    let proxyObj = {};
    for (let prop in obj) {
        Object.defineProperty(proxyObj, prop, {
            configurable: true,
            get() {
                return obj[prop];
            },
            set(value) {
                console.log(getNameSpace(namespace, prop, "+++"))
                obj[prop] = value;
                renderData(vm, getNameSpace(namespace, prop));
            }
        });
        Object.defineProperty(vm, prop, {
            configurable: true,
            get() {
                return obj[prop];
            },
            set(value) {
                console.log(getNameSpace(namespace, prop, "---"))
                obj[prop] = value;
                renderData(vm, getNameSpace(namespace, prop));
            }
        });
        if (obj[prop] instanceof Object) {
            //递归    对象里面套对象
            proxyObj[prop] = constructProxy(vm, obj[prop], getNameSpace(namespace, prop));
        }

    }
    return proxyObj;
};

//处理命名空间 方便后续双向绑定实时查找节点变化
function getNameSpace(nowNameSpace, nowProp) {
    if (nowNameSpace == null || nowNameSpace == "") {
        return nowProp;
    } else if (nowProp == null || nowProp == "") {
        return nowNameSpace;
    } else {
        return nowNameSpace + "." + nowProp;
    }
};

//数组代理
function proxyArr(vm, arr, namespace) {
    let obj = {
        eleType: "Array",
        toString() {
            let result = "";
            for (let i = 0; i < arr.length; i++) {
                result += arr[i] + ", ";
            }
            return result.substring(0, result.length - 2);
        },
        push() {},
        pop() {},
        shift() {},
        unshift() {}
    };
    defArrayFunc.call(vm, obj, "push", namespace, vm);
    defArrayFunc.call(vm, obj, "pop", namespace, vm);
    defArrayFunc.call(vm, obj, "shift", namespace, vm);
    defArrayFunc.call(vm, obj, "unshift", namespace, vm);
    arr.__proto__ = obj;
    return arr;
};

const arrayProto = Array.prototype;

//代理数组方法
function defArrayFunc(obj, func, namespace, vm) {
    Object.defineProperty(obj, func, {
        enumerable: true,
        configurable: true,
        value(...args) { //args新加入的数组对象
            let original = arrayProto[func];
            const result = original.apply(this, args);
            console.log(getNameSpace(namespace, ""));
            renderData(vm, getNameSpace(namespace, prop));
            return result;
        }
    })
};