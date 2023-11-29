import { _decorator, Collider2D, Component, Node, Prefab, RigidBody2D, v3, Vec2, Vec3 } from 'cc';
import { ActorProp, ActorType } from './ActorProp';
import { BlueAngel, Goblin } from './ActorPropDefine';
import { sendNodeMsg } from '../Utils/GMPManager';
import { ActorDead } from '../Utils/GMPKeys';
import { bubbleText } from '../Utils/CommonUtils';
const { ccclass, property } = _decorator;

export enum ActorDirection {
    LEFT = 0,
    RIGHT = 1,
}

export enum ActorState {
    IDLE = 0,
    RUN = 1,
    ATTACK = 2,
    DEAD = 3,
}

@ccclass('Actor')
export class Actor extends Component {

    @property
    ActorType: ActorType = ActorType.Default;

    @property(Prefab)
    damageBubble: Prefab = null;

    public speed: number = 4;
    public direction: ActorDirection = ActorDirection.RIGHT;
    public state: ActorState = ActorState.IDLE;
    public prop: ActorProp = null;

    public IsMoving: boolean = false;

    private _lastMoveFlag: boolean = false;

    private canMove: boolean = true;

    onLoad() {
        if (this.ActorType == ActorType.Default) {
            console.error("ActorType is Default, please set it in the inspector");
        } else if (this.ActorType == ActorType.Player) {
            this.prop = new BlueAngel;
        } else if (this.ActorType == ActorType.CommonEnemy) {
            this.prop = new Goblin;
        }

    }

    start() {
    }

    doDamage(damage: number, source: Actor) {
        damage = damage - this.prop.defense;
        bubbleText( this.damageBubble, damage.toString(), this.node.getChildByName('Head').worldPosition.clone());
        this.prop.hp -= damage;
    }

    update(deltaTime: number) {
        if(this.prop.hp <= 0 ){
            if(this.state != ActorState.DEAD){
                this.state = ActorState.DEAD;
                this.onDead();
            }
            return;
        }
        if (this._lastMoveFlag) {
            this.IsMoving = true;
        } else {
            this.IsMoving = false;
        }
        this._lastMoveFlag = false;
    }

    moveToTick(targetWP: Vec3) {
        if (!this.canMove) {
            return;
        }
        let targetPos = targetWP.clone();
        targetPos.subtract(this.node.worldPosition);
        this.moveDirTick(targetPos);
    }

    moveDirTick(targetWD: Vec3) {
        if (!this.canMove) {
            return;
        }
        let targetPos = targetWD.clone();
        if (targetPos.length() <= 0) {
            return;
        }
        this._lastMoveFlag = true;
        this.node.setWorldPosition(this.node.worldPosition.add(targetPos.normalize().multiplyScalar(this.speed)));
        if (targetPos.x > 0) {
            this.direction = ActorDirection.RIGHT;
        } else if (targetPos.x < 0) {
            this.direction = ActorDirection.LEFT;
        }
    }

    getBody(): Node {
        if (this.ActorType == ActorType.Player) {
            return this.node.getChildByName("Body");
        } else if (this.ActorType == ActorType.CommonEnemy) {
            return this.node;
        }
    }

    onDead() {
        sendNodeMsg(ActorDead, this.node);
        this.canMove = false;
        this.IsMoving = false;
        this.node.getComponents(Collider2D).forEach(element => { element.enabled = false });
        this.node.getComponent(RigidBody2D).enabled = false;
    }

}


