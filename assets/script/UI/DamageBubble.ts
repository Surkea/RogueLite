import { _decorator, Component, Label, Node, Vec3 } from 'cc';
import { BubbleBase } from './BubbleBase';
import { Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DamageBubble')
export class DamageBubble extends BubbleBase {

    private _speed: number = 2;

    private _distance: number = 12;
    private _flyDistance: number = 0;

    private _startColor: Color = new Color(99, 99, 99, 255);
    private _endColor: Color = new Color(255, 255, 255, 255);
    private _tickColor: Color = new Color();


    onLoad() {
        this._label = this.node.getComponent(Label);
        this._label.fontSize = 20;
        this._label.color = this._startColor;
        this._label.isBold = false;
    }

    update(deltaTime: number) {
        super.update(deltaTime);

        if (this._flyDistance < this._distance) {
            // 位置变化
            this.node.setWorldPosition(new Vec3(0, this._speed, 0).add(this.node.worldPosition));
            this._flyDistance += this._speed;

            // 大小变化
            this._label.fontSize += 1.6;

            // 颜色变化
            Color.lerp(this._tickColor, this._startColor, this._endColor, this._flyDistance / this._distance);
            this._label.color = this._tickColor;

            // 加粗
            // if (this._flyDistance >= this._distance) {
            //     this._label.isBold = true;
            // }

            return;
        }

        // 透明度变化
        const newColor = new Color(this._label.color);
        newColor.a -= 9;
        this._label.color = newColor;
    }

}


