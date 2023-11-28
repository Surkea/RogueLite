import { _decorator, Component, Label, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DamageBubble')
export class DamageBubble extends Component {
    private _label: Label = null;
    private _duration: number = 0.5;
    private _elapsedTime: number = 0;
    private _speed: number = 2;
    private _isShowing: boolean = false;

    private _distance: number = 12;
    private _flyDistance :number = 0;


    onLoad() {
        this._label = this.node.getComponent(Label);
    }

    update(deltaTime: number) {
        if (!this._isShowing) return;
        this._elapsedTime += deltaTime;
        if (this._elapsedTime >= this._duration) {
            this.node.destroy();
        }
        if(this._flyDistance < this._distance){
        this.node.setWorldPosition(new Vec3(0, this._speed, 0).add(this.node.worldPosition));
        this._flyDistance += this._speed;
        }
    }

    show(str: string) {
        this._label.string = str;
        this._isShowing = true;
    }
}


