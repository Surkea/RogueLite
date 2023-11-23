import { _decorator, CCObject, Component, Node } from 'cc';
import { findOutermost, getSingletonGeneric } from './SingletonManager';
import { IterableWeakSet } from './IterableWeakSet';

type GMPObjType = CCObject;
type GMPSrcType = Node;
type GMPFuncType = Function;
type GMPKeyType = string;

type Params<F> = F extends (...args: infer P) => any ? P : never;
export type MsgKeyType<F> = [GMPKeyType, F?];

export class GMPManager extends Component {
    public GMPMap: Map<GMPKeyType, GMPData> = new Map();
}
class GMPCallbackData {
    public target: WeakRef<GMPObjType>;
    public callback: GMPFuncType;
    public times: number;

    constructor(intarget: GMPObjType, incb: GMPFuncType, intimes: number) {
        this.target = new WeakRef(intarget);
        this.callback = incb;
        this.times = intimes;
    }
}

class GMPData {
    public storages: Set<GMPCallbackData> = new Set();
    public handlers: WeakMap<object, IterableWeakSet<GMPCallbackData>> = new WeakMap();
    public sources: WeakMap<object, IterableWeakSet<GMPCallbackData>> = new WeakMap();

    // public registry = new FinalizationRegistry((heldValue: [IterableWeakSet<GMPCallbackData>, string]) => {
    public registry = new FinalizationRegistry((heldValue: IterableWeakSet<GMPCallbackData>) => {
        // console.log('GMPData unregistry:  ' + heldValue[1]);
        heldValue.forEach((cb) => { this.storages.delete(cb); });
    });
    public scopecnt: number = 0;
}

function getGMPData(source: Node, msgkey: GMPKeyType, create: boolean = false): GMPData {
    let Mgr = getSingletonGeneric(source, GMPManager);
    let data = Mgr.GMPMap.get(msgkey);
    if (!data && create) {
        data = new GMPData();
        Mgr.GMPMap.set(msgkey, data);
        let set = new IterableWeakSet<GMPCallbackData>();
        data.sources.set(source, set);
    }
    return data;
}

/**
 * @description: 用于发送Obj Level的消息
 * @param {GMPKeyType} msgKey 消息的key
 * @param {GMPSrcType} source 消息的源Node
 * @param {any[]} args 消息传递的参数，任意个数
 */
export function sendNodeMsg(msgKey: GMPKeyType, source: GMPSrcType, ...args: any[]);
/**
 * @description: 用于发送Obj Level的消息
 * @param {MsgKeyType<F>} msgKey 消息的key，需要使用MsgKeyType进行回调函数参数的约束
 * @param {GMPSrcType} source 消息的源Node
 * @param {any[]} args 消息传递的参数，任意个数
 */
export function sendNodeMsg<F>(msgKey: MsgKeyType<F>, source: GMPSrcType, ...args: Params<F>);
export function sendNodeMsg<F>(msgKey: MsgKeyType<F> | GMPKeyType, source: GMPSrcType, ...args: Params<F>) {
    if (typeof msgKey == 'string') {
        sendNodeMsgImpl(msgKey, source, ...args);
    }
    else {
        sendNodeMsgImpl(msgKey[0], source, ...args);
    }
}

/**
 * @description: 用于发送Global Level的消息
 * @param {GMPKeyType} msgKey 消息的key
 * @param {GMPSrcType} source 消息的源Node，用于寻找outtermost对象
 * @param {any[]} args 消息传递的参数，任意个数
 */
export function sendGlobleMsg(msgKey: GMPKeyType, source: GMPSrcType, ...args: any[]);
/**
 * @description: 用于发送Global Level的消息
 * @param {MsgKeyType<F>} msgKey 消息的key，需要使用MsgKeyType进行回调函数参数的约束
 * @param {GMPSrcType} source 消息的源Node，用于寻找outtermost对象
 * @param {any[]} args 消息传递的参数，任意个数
 */
export function sendGlobleMsg<F>(msgKey: MsgKeyType<F>, source: GMPSrcType, ...args: Params<F>);
export function sendGlobleMsg<F>(msgKey: MsgKeyType<F> | GMPKeyType, source: GMPSrcType, ...args: Params<F>) {
    let outermost: Node = findOutermost(source);
    if (typeof msgKey == 'string') {
        sendNodeMsgImpl(msgKey, outermost, ...args);
    }
    else {
        sendNodeMsgImpl(msgKey[0], outermost, ...args);
    }
}

/**
 * @description 用于监听Obj Level的消息
 * @param {GMPKeyType} msgKey 消息的key
 * @param {GMPSrcType} source 消息的源Node
 * @param {Function} callBack 回调函数
 * @param {GMPObjType} target 回调函数的this指向
 * @param {number} times 回调函数的执行次数，不传默认为无限次
 */
export function listenNodeMsg(msgKey: GMPKeyType, source: GMPSrcType, callBack: Function, target: GMPObjType, times?: number): void;
/**
 * @description 用于监听Obj Level的消息
 * @param {MsgKeyType<F>} msgKey 消息的key，需要使用MsgKeyType进行回调函数参数的约束
 * @param {GMPSrcType} source 消息的源Node
 * @param {F} callBack 回调函数，参数收到MsgKeyType约束
 * @param {GMPObjType} target 回调函数的this指向
 * @param {number} times 回调函数的执行次数，不传默认为无限次
 */
export function listenNodeMsg<F>(msgKey: MsgKeyType<F>, source: GMPSrcType, callback: F, target: GMPObjType, times?: number): void;
export function listenNodeMsg<F>(msgKey: MsgKeyType<F> | GMPKeyType, source: GMPSrcType, callback: F, target: GMPObjType, times: number = -1) {
    if (typeof msgKey == 'string') {
        listenNodeMsgImpl(msgKey, source, callback as Function, target, times);
    }
    else {
        listenNodeMsgImpl(msgKey[0], source, callback as Function, target, times);
    }
}
/**
 * @description 用于监听Global Level的消息
 * @param {GMPKeyType} msgKey 消息的key
 * @param {GMPSrcType} source 消息的源Node，用于寻找outtermost对象
 * @param {Function} callBack 回调函数
 * @param {GMPObjType} target 回调函数的this指向
 * @param {number} times 回调函数的执行次数，不传默认为无限次
 */
export function listenGlobalMsg(msgKey: GMPKeyType, source: GMPSrcType, callBack: Function, target: GMPObjType, times?: number);
/**
 * @description 用于监听Global Level的消息
 * @param {MsgKeyType<F>} msgKey 消息的key，需要使用MsgKeyType进行回调函数参数的约束
 * @param {GMPSrcType} source 消息的源Node，用于寻找outtermost对象
 * @param {Function} callBack 回调函数，参数收到MsgKeyType约束
 * @param {GMPObjType} target 回调函数的this指向
 * @param {number} times 回调函数的执行次数，不传默认为无限次
 */
export function listenGlobalMsg<F>(msgKey: MsgKeyType<F> | GMPKeyType, source: GMPSrcType, callback: F, target: GMPObjType, times?: number);
export function listenGlobalMsg<F>(msgKey: MsgKeyType<F> | GMPKeyType, source: GMPSrcType, callback: F, target: GMPObjType, times: number = -1) {
    let outermost: Node = findOutermost(source);
    if (typeof msgKey == 'string') {
        listenNodeMsgImpl(msgKey, outermost, callback as Function, target, times);
    }
    else {
        listenNodeMsgImpl(msgKey[0], outermost, callback as Function, target, times);
    }
}


function sendNodeMsgImpl(msgKey: GMPKeyType, source: GMPSrcType, ...args: any[]) {
    let gmpdata = getGMPData(source, msgKey);
    if (gmpdata == null)
        return;

    let cbArray: GMPCallbackData[] = [];
    if (gmpdata.sources.has(source)) {
        let cbs = gmpdata.sources.get(source);
        cbs.forEach((cb) => {
            cbArray.push(cb);
        });
    }
    let outermost = findOutermost(source);
    if (source != outermost && gmpdata.sources.has(outermost)) {
        let cbs = gmpdata.sources.get(findOutermost(source));
        cbs.forEach((cb) => {
            cbArray.push(cb);
        });
    }

    // gmpdata.scopecnt += 1
    cbArray.forEach((cb) => {
        if (cb.times != 0) {
            cb.callback.apply(cb.target.deref(), args);
        }
        if (cb.times > 0)
            cb.times -= 1;
        if (cb.times == 0) {
            // if (gmpdata.handlers.get(cb.target).size == 0)
            // {
            //     gmpdata.handlers.delete(cb.target);
            //     if(!gmpdata.sources.has(cb.target))
            //     {
            //         gmpdata.registry.unregister(cb.target);
            //     }
            // }
            gmpdata.storages.delete(cb);
        }
    }
    );

    // gmpdata.scopecnt -= 1;
}


function listenNodeMsgImpl(msgKey: GMPKeyType, source: GMPSrcType, callBack: Function, target: GMPObjType, times: number = -1) {
    let gmpdata = getGMPData(source, msgKey, true);

    let cb = new GMPCallbackData(target, callBack, times);
    gmpdata.storages.add(cb);
    // 处理sources
    if (!gmpdata.sources.has(source)) {
        let set = new IterableWeakSet<GMPCallbackData>();
        set.add(cb);
        gmpdata.sources.set(source, set);
        gmpdata.registry.register(source, set, source);
        // gmpdata.registry.register(source, [set, 'source: ' + source.name.toString() + ' | msgKey: ' + msgKey], source);
    } else {
        gmpdata.sources.get(source).add(cb);
    }
    // 处理handlers
    if (!gmpdata.handlers.has(target)) {
        let set = new IterableWeakSet<GMPCallbackData>();
        set.add(cb);
        gmpdata.handlers.set(target, set);
        gmpdata.registry.register(target, set, target);
        // gmpdata.registry.register(target, [set, 'handler: ' + target.name.toString() + ' | msgKey: ' + msgKey], target);
    } else {
        gmpdata.handlers.get(target).add(cb);
    }

}

export function unlistenImpl(msgKey: GMPKeyType, target: GMPObjType, callBack?: Function, source?: GMPSrcType) {
    let gmpdata = getGMPData(source, msgKey);

    let deleteArray: GMPCallbackData[] = [];
    if (source != null && gmpdata.sources.has(source)) {
        gmpdata.sources.get(source).forEach((cb) => {
            if (cb.target.deref() == target && (!callBack || callBack == cb.callback)) {
                deleteArray.push(cb);
            }
        });
        if (deleteArray.length == gmpdata.sources.get(source).size) {
            gmpdata.registry.unregister(source);
            gmpdata.sources.delete(source);
        }
    } else {
        gmpdata.handlers.get(target).forEach((cb) => {
            if (callBack == null || cb.callback == callBack) {
                deleteArray.push(cb);
            }
            if (deleteArray.length == gmpdata.handlers.get(target).size) {
                gmpdata.registry.unregister(target);
                gmpdata.handlers.delete(target);
            }
        });
    }
    deleteArray.forEach((cb) => { gmpdata.storages.delete(cb) });

}


// 使用demo
// const MsgKeyDemo: MsgKeyType<(a: number, b: Node, c: string) => {}> = ['Demo'];
// // const MsgKeyDemo: MsgKeyType<(a: number, b: Node, c: string) => void> = ['Demo'];
// function SendTest() {
//     sendNodeMsg(MsgKeyDemo, new Node(), 1, new Node(), '0');
// }
// function ListenTest() {
//     listenNodeMsg(MsgKeyDemo, new Node(), (a,b,c) => {}, new Node());
// }

// export function printInfo(msgKey: GMPKeyType, source: GMPSrcType) {
//     let gmpdata = getGMPData(source, msgKey, true);
//     console.log(gmpdata);

// }