import { _decorator, Component, Node } from 'cc';
import { Actor } from './Actor';
import { getSingletonGeneric } from '../Utils/SingletonManager';
import { Level } from '../Level/Level';
const { ccclass, property } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {

    
    private target: Actor = null;
    private _actor: Actor = null;
    start() {
        this._actor = this.node.getComponent(Actor);
        this._actor.speed = 2;
        this.target = getSingletonGeneric(this.node, Level).player;

    }

    update(deltaTime: number) {
        this._actor.moveToTick(this.target.node.worldPosition);
    }
}


