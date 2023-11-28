import { _decorator, Component, Node } from 'cc';
import { ActorProp, ActorType } from './ActorProp';
const { ccclass, property } = _decorator;

export class BlueAngel extends ActorProp {
    id = 0;
    type = ActorType.Player;
    level = 1;
    hp = 100;
    maxHp = 100;
    exp = 0;
    maxExp = 100;
    dropExp = 0;
    defense = 0;
    attack = 10;
    speed = 4;
}

export class Goblin extends ActorProp {
    id = 1;
    type = ActorType.CommonEnemy;
    level = 1;
    hp = 10
    maxHp = 10;
    exp = 0;
    maxExp = 100;
    dropExp = 10;
    defense = 0;
    attack = 10;
    speed = 3;
}


