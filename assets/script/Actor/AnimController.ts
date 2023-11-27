import { _decorator, Component, Node, sp, Vec3 } from 'cc';
import { Actor, ActorDirection } from './Actor';
import { ActorType } from './ActorProp';
const { ccclass, property } = _decorator;

const AnimIdle = "idle";
const AnimRun = "run";

@ccclass('AnimController')
export class AnimController extends Component {

    private _actor: Actor = null;
    private _spine: sp.Skeleton = null;

    private _scaleX: number = 1;
    private _scaleY: number = 1;
    private _scaleZ: number = 1;

    start() {
        this._actor = this.node.getComponent(Actor);
        if (this._actor.ActorType == ActorType.CommonEnemy) {
            this._spine = this._actor.node.getComponent(sp.Skeleton);
        } else if (this._actor.ActorType == ActorType.Player) {
            this._spine = this._actor.getBody().getChildByName('Skin').getComponent(sp.Skeleton);
        }
        this._scaleX = this._actor.getBody().scale.x;
        this._scaleY = this._actor.getBody().scale.y;
        this._scaleZ = this._actor.getBody().scale.z;
    }


    update(deltaTime: number) {
        if (this._actor.direction == ActorDirection.LEFT) {
            this._actor.getBody().setScale(-this._scaleX, this._scaleY, this._scaleZ);
        } else {
            this._actor.getBody().setScale(this._scaleX, this._scaleY, this._scaleZ);
        }

        if (this._actor.IsMoving && this._spine.animation == AnimIdle) {
            this._spine.setAnimation(0, AnimRun, true);
        } else if (!this._actor.IsMoving && this._spine.animation == AnimRun) {
            this._spine.setAnimation(0, AnimIdle, true);
        }
    }

}
