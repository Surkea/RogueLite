import { _decorator, Component, Node, v3, Vec2, Vec3 } from 'cc';
import { ActorProp, ActorType } from './ActorProp';
import { BlueAngel, Goblin } from './ActorPropDefine';
const { ccclass, property } = _decorator;

export enum ActorDirection{
    LEFT = 0,
    RIGHT = 1,
}

@ccclass('Actor')
export class Actor extends Component {

    @property
    ActorType: ActorType = ActorType.Default;

    public speed: number = 4;
    public direction: ActorDirection = ActorDirection.RIGHT;
    public prop : ActorProp = new ActorProp();

    public IsMoving: boolean = false;

    private _lastMoveFlag: boolean = false;

    onLoad(){
        if(this.ActorType == ActorType.Default){
            console.error("ActorType is Default, please set it in the inspector");
        }else if(this.ActorType == ActorType.Player){
            this.prop = BlueAngel;
        }else if(this.ActorType == ActorType.CommonEnemy){
            this.prop = Goblin;
        }
    
    }

    start() {
    }

    update(deltaTime: number) {
        if(this._lastMoveFlag){
            this.IsMoving = true;
        }else{
            this.IsMoving = false;
        }
        this._lastMoveFlag = false;
    }

    moveToTick(targetWP: Vec3) {
        let targetPos = targetWP.clone();
        targetPos.subtract(this.node.worldPosition);
        this.moveDirTick(targetPos);
    }

    moveDirTick(targetWD: Vec3) {
        let targetPos = targetWD.clone();
        if(targetPos.length() <= 0){
            return;
        }
        this._lastMoveFlag = true;
        this.node.setWorldPosition(this.node.worldPosition.add(targetPos.normalize().multiplyScalar(this.speed)));
        if(targetPos.x > 0){
            this.direction = ActorDirection.RIGHT;
        }else if(targetPos.x < 0){
            this.direction = ActorDirection.LEFT;
        }
    }

    getBody(): Node{
        if(this.ActorType == ActorType.Player){
            return this.node.getChildByName("Body");
        }else if(this.ActorType == ActorType.CommonEnemy){
            return this.node;
        }
    }

}


