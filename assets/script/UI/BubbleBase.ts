import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BubbleBase')
export class BubbleBase extends Component {
    protected _label: Label = null;
    protected _duration: number = 0.5;
    protected _elapsedTime: number = 0;

    protected _isShowing: boolean = false;


    onLoad() {
        this._label = this.node.getComponent(Label);
    }

    update(deltaTime: number) {
        if (!this._isShowing)
            return;
        
        this._elapsedTime += deltaTime;
        if (this._elapsedTime >= this._duration) {
            this.node.destroy();
        }
    }

    onShow(str: string) {
        this._label.string = str;
        this._isShowing = true;
    }
}


