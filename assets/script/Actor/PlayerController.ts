import { _decorator, Component, Vec3 } from 'cc';
import { JoystickController } from '../Controller/JoystickController';
import { Actor } from './Actor';
import { getSingletonGeneric } from '../Utils/SingletonManager';
import { Level } from '../Level/Level';
const { ccclass, requireComponent } = _decorator;

@ccclass('PlayerController')
@requireComponent(Actor)
export class PlayerController extends Component {

    private _direction: Vec3 = new Vec3(0, 0, 0);
    private _actor: Actor = null;

    start() {
        this._actor = this.node.getComponent(Actor);
        getSingletonGeneric(this.node, Level).player = this._actor;
    }

    update(deltaTime: number) {
        this._direction.x = JoystickController.horizontal;
        this._direction.y = JoystickController.vertical;
        this._direction.z = 0;

        this._actor.moveDirTick(this._direction);
    }
}


