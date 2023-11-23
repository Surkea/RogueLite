import { _decorator, Component, Node, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export enum ActorDirection{
    LEFT = 0,
    RIGHT = 1,
}

@ccclass('Actor')
export class Actor extends Component {

    public speed: number = 4;
    public direction: ActorDirection = ActorDirection.RIGHT;

    public IsMoving: boolean = false;

    private _lastMoveFlag: boolean = false;

    onLoad(){
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
        return this.node.getChildByName("Body");
    }

}

