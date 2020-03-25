/*tag标签类型 DIV SPAN等    #TEXT文本节点
ele对应真实节点
children当前节点下的子节点
text当前虚拟节点下的文本
data VNodeData
 */
export default class VNode {
    constructor(tag, ele, children, text, data, parent, nodeType) {
        this.tag = tag;
        this.ele = ele;
        this.children = children;
        this.text = text;
        this.data = data;
        this.parent = parent;
        this.nodeType = nodeType;
        this.env = {}; //当前节点环境变量
        this.instructions = null; //存放指令
        this.template = []; // 当前节点涉及的模板
    }
}