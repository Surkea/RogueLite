import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, RigidBody2D } from 'cc';
import { Actor } from '../Actor/Actor';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {

    private _collider: Collider2D = null;
    private _atttack: number = 0;
    private souece: Actor = null;
    private _hitTimes: number = 1;
    private _flyTimes: number = 5;

    setProp(attack: number, source: Actor, hitTimes?:number, flyTimes?:number){
        this._atttack = attack;
        this.souece = source;
        if(hitTimes)
            this._hitTimes = hitTimes;
        if(flyTimes)
            this._flyTimes = flyTimes;
    }

    start() {
        this._collider = this.node.getComponent(Collider2D);
        this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    update(deltaTime: number) {
        this._flyTimes -= deltaTime;
        if(this._hitTimes <= 0 || this._flyTimes <= 0){
            this.node.destroy();
        }
    }

    
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 检查碰撞的物体
        let otherActor = otherCollider.node.getComponent(Actor);
        if(otherActor && otherActor != this.souece){
            otherActor.doDamage(this._atttack, this.souece);
            this._hitTimes --;
        }
        
    }

}


