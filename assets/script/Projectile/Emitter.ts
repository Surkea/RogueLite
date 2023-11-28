import { _decorator, Component, director, instantiate, Node, Prefab, RigidBody2D, v2, v3 } from 'cc';
import { Bullet } from './Bullet';
import { Actor } from '../Actor/Actor';
const { ccclass, property } = _decorator;

@ccclass('Emitter')
export class Emitter extends Component {
    @property(Prefab)
    BulletPrefab: Prefab = null;
    private _actor: Actor = null;
    private _speed: number = 5;

    private _elapsedTime: number = 0;
    private _interval: number = 0.6;

    private _elapsedTimeTotal: number = 0;
    private _duration: number = -1;

    private _parent: Node = null;

    start() {
        this._parent = director.getScene().getChildByName('InGame').getChildByName('Projectiles');
        this._actor = this.node.getComponent(Actor);
    }

    update(deltaTime: number) {
        this._elapsedTime += deltaTime;
        this._elapsedTimeTotal += deltaTime;
        if (this._elapsedTime >= this._interval) {
            this._elapsedTime = 0;
            this.emit();
        }
    }

    emit() {
        if (this.BulletPrefab) {
            // 设置运动方向，朝向周围最近的敌人
            let target = this.getNearestEnemy();
            if (target) {
                // 实例化一个子弹
                let bullet = instantiate(this.BulletPrefab);
                bullet.getComponent(Bullet).setAttack(this._actor.prop.attack, this.node.getComponent(Actor));
                this._parent.addChild(bullet);
                bullet.setWorldPosition(this.node.worldPosition.clone().add(v3(0, 55, 0)));
                // console.log("target:", target.name)
                let dir = target.worldPosition.clone();
                dir.subtract(this.node.worldPosition);
                bullet.getComponent(RigidBody2D).linearVelocity = v2(dir.x, dir.y).normalize().multiplyScalar(this._speed);
            }
        }
    }

    getNearestEnemy(): Node {
        let enemies = director.getScene().getChildByName('InGame').getChildByName('Enemies');
        let children = enemies.children;
        let minDist = 800;
        let nearestEnemy = null;
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let dist = child.worldPosition.clone().subtract(this.node.worldPosition).length();
            if (dist < minDist) {
                minDist = dist;
                nearestEnemy = child;
            }
        }
        return nearestEnemy;
    }
}


