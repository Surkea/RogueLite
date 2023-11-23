import { _decorator, Component, EventTouch, Input, Node, Vec3, v3, CCFloat, math, EventTarget } from 'cc';
import { sendGlobleMsg } from '../Utils/GMPManager';
import {TouchEnd, TouchStart } from '../Utils/GMPKeys';
const { ccclass, property } = _decorator;

@ccclass('JoystickController')
export class JoystickController extends Component {

    @property(CCFloat)
    Radius : number = 100 ;

    static horizontal : number = 0;
    static vertical : number = 0;
    static bIsMoving: boolean = false;

    private joystick : Node; 
    private stick: Node;
    private DefaultPos: Vec3;

    onLoad() {
        this.joystick = this.node.children[0];
        this.stick = this.joystick.children[0];
        this.DefaultPos = this.joystick.getWorldPosition().clone();

        this.node.on(Input.EventType.TOUCH_START, this.TouchStart, this);
        this.node.on(Input.EventType.TOUCH_END, this.TouchEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.TouchEnd, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.TouchMove, this);
    }

    onDestroy(){
        this.node.off(Input.EventType.TOUCH_START, this.TouchStart, this);
        this.node.off(Input.EventType.TOUCH_END, this.TouchEnd, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this.TouchEnd, this);
        this.node.off(Input.EventType.TOUCH_MOVE, this.TouchMove, this);
    }


    update() {
        // 创建一个表示Joystick.horizontal和Joystick.vertical的向量
        let direction = new Vec3(JoystickController.horizontal, JoystickController.vertical, 0);

        // 正则化向量
        direction.normalize();

        // 将正则化后的向量的x和y坐标赋值回Joystick.horizontal和Joystick.vertical
        JoystickController.horizontal = direction.x;
        JoystickController.vertical = direction.y;
    }

    TouchStart(event: EventTouch) {
        let x = event.touch.getUILocationX();
        let y = event.touch.getUILocationY();
        this.joystick.setWorldPosition(x,y,0);
        JoystickController.bIsMoving = true;
        sendGlobleMsg(TouchStart,this.node);
    }

    TouchEnd() {
        this.joystick.setWorldPosition(this.DefaultPos);
        this.stick.setPosition(v3());
        JoystickController.horizontal = 0;
        JoystickController.vertical = 0;
        JoystickController.bIsMoving = false;
        sendGlobleMsg(TouchEnd, this.node);
    }

    TouchMove(event: EventTouch){
        let x = event.touch.getUILocationX();
        let y = event.touch.getUILocationY();

        let JoySticklocalPosition = v3();

        //世界坐标转换为本地坐标
        this.joystick.inverseTransformPoint(JoySticklocalPosition, new Vec3(x, y, 0));
        let length = JoySticklocalPosition.length();
        //得到移动的方向和最终位置
        JoySticklocalPosition.normalize().multiplyScalar(math.clamp(length, 0, this.Radius));

        this.stick.setPosition(JoySticklocalPosition);

        JoystickController.horizontal = this.stick.position.x / this.Radius;
        JoystickController.vertical = this.stick.position.y / this.Radius;


    }
}