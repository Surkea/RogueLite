import { _decorator, CCObject, Node } from 'cc';
const { ccclass, property } = _decorator;


class SingletonData{
    private DataMap : Map<string, any> = new Map();
}


export class SingletonManager extends CCObject {
    
    static ManagerMap = new WeakMap();
    // 空的占位，用于获取最外层（各个scene的更高一级）的outtermost
    static world = new Node();
    }

/**
 * @description: 用于获取单例，生命周期为整个游戏
 * @param {Node} context 上下文，传入Node
 * @param {new()=> T} Cls 传入需要生成单例的Class
   */
export function getSingletonGeneric<T extends CCObject>(context: Node, Cls: new()=> T): T {
    let outter = findOutermost(context);

    if(!SingletonManager.ManagerMap.has(outter)){
        SingletonManager.ManagerMap.set(outter,new SingletonData());
    }
    
    let data = SingletonManager.ManagerMap.get(outter);

    if(data.DataMap.has(Cls.name)){
        return data.DataMap.get(Cls.name) as T;
    }else{
        let newObj = new Cls;
        data.DataMap.set(Cls.name, newObj);
        return newObj;
    }
}


/**
 * @description 用于获取最外层的context
 * @param context 传入的context
 * @returns 返回最外层的context
 */
export function findOutermost(context: Node): Node{
    // if(context.parent == null){
    //     return context;
    // }else{
    //     return this.findOutterMost(context.parent);
    // }
    return SingletonManager.world;
}