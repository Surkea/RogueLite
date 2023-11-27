import { _decorator, Component, Node } from 'cc';

export enum ActorType{
    Default = -1,
    Player = 0,
    CommonEnemy = 1,
    EliteEnemy = 2,
    Boss = 3,
}

export class ActorProp {
    public id: number = -1;
    public type: ActorType = ActorType.Default;
    public level: number = 1;
    public hp: number = 100;
    public maxHp: number = 100;
    public exp: number = 0;
    public maxExp: number = 100;
    public dropExp: number = 0;
    public defense: number = 0;
    public attack: number = 0;
    public speed: number = 1;
}


