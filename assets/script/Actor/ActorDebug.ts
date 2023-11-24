import { _decorator, Component, Label, Node } from 'cc';
import { Actor } from './Actor';
const { ccclass, property } = _decorator;

@ccclass('ActorDebug')
export class ActorDebug extends Component {
    private _actor: Actor = null;
    private _debugLabel: Label = null;

    onLoad() {
        this._actor = this.node.getComponent(Actor);
    }
    start() {
        let node = new Node('debug');
        this.node.addChild(node);
        node.layer = this.node.layer;
        node.setPosition(0, -80);
        this._debugLabel = node.addComponent(Label);
        this._debugLabel.fontSize = 12;
        this._debugLabel.lineHeight = 16;
        this._debugLabel.cacheMode = Label.CacheMode.CHAR;
    }

    update(deltaTime: number) {
        this.drawDebugInfo();
    }

    drawDebugInfo() {
        this._debugLabel.string = this.node.worldPosition.toString() + '\n';
        if (1) {
            if (1)
                this._debugLabel.string += 'IsMoving:' + this._actor.IsMoving;
        }
    }
}


