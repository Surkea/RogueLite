import { _decorator, Color, Component, director, instantiate, Label, Node, Prefab, resources, Vec3 } from 'cc';
import { DamageBubble } from '../UI/DamageBubble';
const { ccclass, property } = _decorator;

@ccclass('CommonUtils')
export class CommonUtils extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
}

/**
* @zh 适用于Vec3的二次插值。
* @param baseValue 插值前的基础数字
* @param targetValue 插值的目标数字
* @param ratio 插值的比例，取值0~1，0靠向baseValue，1靠向targetValue
* @param precision 结果值于targetValue的差值小于precision时，直接返回targetValue，防止计算量过大，默认为1e-2
* @return 插值的结果
*/
export function quadraticLerpVec(baseValue: Vec3, targetValue: Vec3, ratio: number, precision: number = 1e-2): Vec3 {
    // 计算中间点 B 为 A 和 C 的平均值
    const midTemp = new Vec3();
    Vec3.lerp(midTemp, baseValue, targetValue, ratio);

    const temp1 = new Vec3();
    const temp2 = new Vec3();
    const temp3 = new Vec3();
    const result = new Vec3();

    // 计算 (1 - t)^2 * A
    Vec3.multiplyScalar(temp1, baseValue, Math.pow(1 - ratio, 2));

    // 计算 2 * (1 - t) * t * B
    Vec3.multiplyScalar(temp2, midTemp, 2 * (1 - ratio) * ratio);

    // 计算 t^2 * C
    Vec3.multiplyScalar(temp3, targetValue, Math.pow(ratio, 2));

    // 计算最终结果
    Vec3.add(result, temp1, temp2);
    Vec3.add(result, result, temp3);

    // 如果结果和目标值足够接近，则直接返回目标值
    if (Vec3.distance(result, targetValue) < precision) {
        return targetValue.clone();
    }


    return result;
}

export function quadraticLerpRatioCal(baseValue: Vec3, targetValue: Vec3, step: number): number {

    let delta = new Vec3();
    Vec3.subtract(delta, targetValue, baseValue);
    let ratio = 1 - Math.pow(1 - delta.length() / targetValue.length(), 1 / step);

    return ratio;
}

/**
* @zh 适用于Number的线性插值。
* @param baseValue 插值前的基础数字
* @param targetValue 插值的目标数字
* @param ratio 插值的比例，取值0~1，0靠向baseValue，1靠向targetValue
* @param precision 结果值于targetValue的差值小于precision时，直接返回targetValue，防止计算量过大，默认为1e-2
* @return 插值的结果
*/
export function linearLerpNumber(baseValue: number, targetValue: number, ratio: number, precision: number = 1e-2): number {
    let result = (1 - ratio) * baseValue + ratio * targetValue;

    return Math.abs(result - targetValue) < precision ? targetValue : result;
}
export function clampNumber(val: number, min: number, max: number): number {
    if (val < min) {
        return min;
    } else if (val > max) {
        return max;
    } else {
        return val;
    }
}
/**
* @zh 比较两个数的大小。
* @param a
* @param b
* @return 两者中的大值
*/
export function mathMax(a: number, b: number): number {
    return a > b ? a : b;
}

/**
* @zh 比较两个数的大小。
* @param a
* @param b
* @return 两者中的小值
*/
export function mathMin(a: number, b: number): number {
    return a < b ? a : b;
}


export function deepCopy(source: any): any {
    if (source === null || typeof source !== 'object') {
        return source;
    }

    // Handle Date
    if (source instanceof Date) {
        return new Date(source.getTime());
    }

    // Handle Array
    if (Array.isArray(source)) {
        const copy = [];
        for (let i = 0, len = source.length; i < len; i++) {
            copy[i] = deepCopy(source[i]);
        }
        return copy;
    }

    // Handle Object
    if (source instanceof Object) {
        const copy = Object.create(Object.getPrototypeOf(source));
        Object.getOwnPropertyNames(source).forEach((prop) => {
            Object.defineProperty(copy, prop, Object.getOwnPropertyDescriptor(source, prop));
        });

        for (let prop in source) {
            if (source.hasOwnProperty(prop)) copy[prop] = deepCopy(source[prop]);
        }
        return copy;
    }

    throw new Error("Unable to copy source! Its type isn't supported.");
}

export function loadSrc(url: string, type: any, callback: Function) {
    resources.load(url, type, (err, asset) => {
        if (err) {
            console.log(err);
            return;
        }
        callback(asset);
    });
}

export function bubbleText(bubble: Prefab, str: string, pos: Vec3){
    let node = instantiate(bubble);
    node.setParent(director.getScene().getChildByName('InGame').getChildByName('Bubble'));
    node.setWorldPosition(pos);
    node.getComponent(DamageBubble).show(str);

}
/* export function getActorsInCircleCollider(center: Vec3, radius: number, IncludeEnemy: boolean, IncludeFood: boolean, InclucdePlayer: boolean = false): Actor[] {
    // 假设 circleCollider 是你的 CircleCollider2D 实例
    let worldPosition = center.clone();

    // 创建 AABB 查询框
    let aabb = new Rect(worldPosition.x - radius, worldPosition.y - radius, radius * 2, radius * 2);

    // 查询这个区域内的碰撞体
    let colliderList = PhysicsSystem2D.instance.testAABB(aabb);

    // 筛选位于实际圆形区域内的对象, 比如四个角落的actor要排除
    let withinCircle = colliderList.filter(collider => {
        let colliderPos = collider.node.worldPosition;
        let distance = Vec2.distance(worldPosition, colliderPos);
        return collider.tag == 0 && distance <= radius;
    });

    //筛选排除
    let actors: Actor[] = [];
    withinCircle.forEach(collider => {
        let a = collider.node.getComponent(Actor)
        if (!a)
            return;
        if (IncludeEnemy && a.actorType == ActorType.enemy)
            actors.push(a);
        else if (IncludeFood && a.actorType == ActorType.food)
            actors.push(a);
        else if (InclucdePlayer && a.actorType == ActorType.player)
            actors.push(a);
    })

    return actors;

}
 */

