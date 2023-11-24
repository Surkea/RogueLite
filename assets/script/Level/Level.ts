import { _decorator, Camera, Component, instantiate, Node, Prefab, randomRange, UITransform, Vec3, view } from 'cc';
import { getSingletonGeneric } from '../Utils/SingletonManager';
import { Actor } from '../Actor/Actor';
const { ccclass, property } = _decorator;

@ccclass('Level')
export class Level extends Component {

    public levelCamera: Camera = null;
    public player: Actor = null;
    @property(Prefab)
    public enemyPrefab: Prefab = null;


    private _timer: number = 0;
    private _enemyCount: number = 0;
    private _enemyMaxCount: number = 500;
    private _enemySpawnInterval: number = 0.1;
    private _enemySpawnDistance: number = 200;

    start() {

    }

    update(deltaTime: number) {
        this._timer += deltaTime;
        if (this._timer >= this._enemySpawnInterval) {
            this._timer = 0;
            this.spawnEnemy();
        }
    }

    spawnEnemy() {
        if (this._enemyCount >= this._enemyMaxCount) return;
        let canvas = this.node.parent;
        let screenSize = view.getVisibleSize();
        let camPos = getSingletonGeneric(this.node, Level).levelCamera.node.worldPosition;

        // 在摄像机视野的边缘生成敌人
        let side = Math.floor(Math.random() * 4); // 随机选择一个边（0上, 1右, 2下, 3左）
        let spawnPos = new Vec3();

        switch (side) {
            case 0: // 上
                 spawnPos.x = camPos.x + (Math.random() - 0.5) * screenSize.width;
                 spawnPos.y = camPos.y + screenSize.height / 2 + this._enemySpawnDistance; // 50单位在视野边缘之外
                 break;
             case 1: // 右
                 spawnPos.x = camPos.x + screenSize.width / 2 + this._enemySpawnDistance;
                 spawnPos.y = camPos.y + (Math.random() - 0.5) * screenSize.height;
                 break;
             case 2: // 下
                 spawnPos.x = camPos.x + (Math.random() - 0.5) * screenSize.width;
                 spawnPos.y = camPos.y - screenSize.height / 2 - this._enemySpawnDistance;
                 break;
             case 3: // 左
                 spawnPos.x = camPos.x - screenSize.width / 2 - this._enemySpawnDistance;
                 spawnPos.y = camPos.y + (Math.random() - 0.5) * screenSize.height;
                 break;
        }

        // Instantiate the enemy prefab at the random position
        let enemy = instantiate(this.enemyPrefab);
        canvas.addChild(enemy);
        enemy.setWorldPosition(spawnPos);

        this._enemyCount++;
        // console.log('enemy spawned at: ' + spawnPos.x.toFixed(2) + ', ' + spawnPos.y.toFixed(2) + ', ' + spawnPos.z.toFixed(2));
    }
}


