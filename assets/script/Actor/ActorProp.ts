import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ActorProp')
export class ActorProp extends Component {
    public id: number = -1;
    public level: number = 1;
    public hp: number = 100;
    public maxHp: number = 100;
    public exp: number = 0;
    public maxExp: number = 100;
    public defense: number = 0;
    public attack: number = 0;
    public speed: number = 0;
}


