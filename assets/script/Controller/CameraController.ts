import { _decorator, Camera, CCFloat, Component, Node, v3 } from 'cc';
import { quadraticLerpVec } from '../Utils/CommonUtils';
import { getSingletonGeneric } from '../Utils/SingletonManager';
import { Level } from '../Level/Level';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {

    @property(Node)
    FollowTarget: Node;
    @property(CCFloat)
    private FollowSpeed: number = 0.2;

    private _actorCamera: Camera = null;
    
    start() {
        this._actorCamera = this.node.getChildByName('PlayerCamera').getComponent(Camera);
        getSingletonGeneric(this.node, Level).levelCamera = this._actorCamera;
    }

    update(deltaTime: number) {
        if (!this.FollowTarget) return;

        let finalPos = quadraticLerpVec(this.node.getWorldPosition(), this.FollowTarget.getWorldPosition(), this.FollowSpeed);
 
        this.node.setWorldPosition(finalPos);
    }
}


