class AcGameMenu{
    constructor(root){
        this.root=root;
        this.$menu=$(`
<div class="ac-game-menu">
    <div class="ac-game-menu-title">
        欧罗巴七号
    </div>
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item-single-mode">
            单人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item-multi-mode">
            多人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item-settings">
            设置
        </div>
    </div>
</div>
`);
        this.root.$ac_game.append(this.$menu);
        this.$title=this.$menu.find(".ac-game-menu-title");
        this.$single_mode=this.$menu.find(".ac-game-menu-field-item-single-mode");
        this.$multi_mode=this.$menu.find(".ac-game-menu-field-item-multi-mode");
        this.$settings=this.$menu.find(".ac-game-menu-field-item-settings");
        this.start();
    }

    start(){
        this.add_listening_events();
    }
    
    add_listening_events(){
        let outer=this;
        this.$single_mode.click(function(){
            outer.hide();
            outer.root.playground.show();
        })
        this.$multi_mode.click(function(){

        });
        this.$settings.click(function(){

        });
    }

    show(){
        this.$menu.show();
    }

    hide(){
        this.$menu.hide();
    }
}
let AC_GAME_OBJECTS=[];

class AcGameObject{
    constructor(){
        AC_GAME_OBJECTS.push(this);
        this.has_call_start=false;
        this.timedelta=0;
    }

    start(){

    }

    update(){

    }

    on_destroy(){

    }

    destroy(){
        this.on_destroy();
        for(let i=0;i<AC_GAME_OBJECTS.length;i++){
            if(AC_GAME_OBJECTS[i]===this){
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestp;
let AC_GAME_ANIMATION=function(timestp){
    for(let i=0;i<AC_GAME_OBJECTS.length;i++){
        let obj=AC_GAME_OBJECTS[i];
        if(!obj.has_called_start){
            obj.start();
            obj.has_called_start=true;
        }
        else{
            obj.timedelta=timestp-last_timestp;
            obj.update();
        }
    }
    last_timestp=timestp;
    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);
class GameMap extends AcGameObject
{
    constructor(playground){
        super();
        this.playground=playground;
        this.playground = playground; // 这个Map是属于这个playground的
        this.$canvas = $(`<canvas></canvas>`); // canvas是画布
        this.ctx = this.$canvas[0].getContext('2d'); // 用ctx操作画布canvas
        this.ctx.canvas.width = this.playground.width; // 设置画布的宽度
        this.ctx.canvas.height = this.playground.height; // 设置画布的高度
        this.playground.$playground.append(this.$canvas); // 将这个画布加入到这个playground
    }

    render(){
        this.ctx.fillStyle="rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height);
    }

    start(){

    }

    update(){
        this.render();
    }
}
class Particle extends AcGameObject{
    constructor(playground, x, y, radius, vx, vy, color, speed) {
        super();
        this.playground=playground;
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.vx=vx;
        this.vy=vy;
        this.color=color;
        this.speed=speed;
        this.friction=0.9;
        this.eps=1;
        this.ctx=this.playground.game_map.ctx;
    }

    start(){

    }

    update(){
        if(this.speed<this.eps){
            this.destroy();
            return(false);
        }
        this.x+=this.vx*this.speed*this.timedelta/1000;
        this.y+=this.vy*this.speed*this.timedelta/1000;
        this.speed*=this.friction;
        this.render();
    }

    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class Player extends AcGameObject{
    constructor(playground, x, y, radius, color, is_me, speed){
        super(true);
        this.playground=playground;
        this.ctx=this.playground.game_map.ctx;

        this.x=x;
        this.y=y;
        this.move_length=0;
        this.radius=radius;
        this.color=color;
        this.is_me=is_me;
        this.speed=speed;
        this.is_alive=true;
        this.eps=0.1;
        this.cur_skill=null;

        this.damagex=0;
        this.damagey=0;
        this.damage_speed=0;
        this.friction=0.9;
    }

    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    get_dist(x1, y1, x2, y2){
        let dx = x1 - x2, dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty){
        this.move_length=this.get_dist(this.x, this.y, tx, ty);
        let dx=tx-this.x, dy=ty-this.y;
        let angle=Math.atan2(dy, dx);
        this.vx=Math.cos(angle);
        this.vy=Math.sin(angle);
    }

    add_listening_events(){
        let outer=this;
        this.playground.game_map.$canvas.on("contextmenu", function(){
            return(false);
        });

        this.playground.game_map.$canvas.mousedown(function(e){
            if(!outer.is_alive) return(false);
            if(e.which===3){
                outer.move_to(e.clientX, e.clientY);
            }
            if(e.which===1){
                if(outer.cur_skill==="fireball"){
                    outer.shoot_fireball(e.clientX, e.clientY);
                }
                outer.cur_skill=null;
            }
        });

        $(window).keydown(function(e){
            if(!outer.is_alive) return(false);
            if(e.which===81){
                outer.cur_skill="fireball";
                return(false);
            }
        });
    }

    start(){
        this.open_time=5;
        if(this.is_me){
            this.add_listening_events();
        }
        else{
            let tx=Math.random()*this.playground.width;
            let ty=Math.random()*this.playground.height;
            this.move_to(tx, ty);
        }
    }

    update(){
        if(this.open_time>0){
            this.open_time-=this.timedelta/1000;
        }
        else{
            if(Math.random()<1/300){
                let player=this.playground.players[0];
                this.shoot_fireball(player.x, player.y);
            }
        }

        if(this.damage_speed>=10){
            this.move_length=0;
            this.vx=0;
            this.vy=0;
            this.x+=this.damagex*this.damage_speed*this.timedelta/1000;
            this.y+=this.damagey*this.damage_speed*this.timedelta/1000;
            this.damage_speed*=this.friction;
        }
        else{
            if(this.move_length<this.eps){
                this.move_length=0;
                this.vx=0;
                this.vy=0;
                if(!this.is_me){
                    let tx=Math.random()*this.playground.width;
                    let ty=Math.random()*this.playground.height;
                    this.move_to(tx, ty);
                }
            }
            else{
                let moved = Math.min(this.move_length, this.speed*this.timedelta/1000);
                this.x+=this.vx*moved;
                this.y+=this.vy*moved;
                this.move_length-=moved;
            }
        }
        this.render();
    }

    on_destroy(){
        this.is_alive=false;
        for(let i=0;i<this.playground.players.length;i++){
            let player=this.playground.players[i];
            if(this===player){
                this.playground.players.splice(i, 1);
            }
        }
    }

    shoot_fireball(tx, ty){
        let x=this.x, y=this.y;
        let radius=this.playground.height*0.01;
        let angle=Math.atan2(ty-this.y, tx-this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color="orange";
        let speed=this.playground.height*0.5;
        let move_length=this.playground.height*1.5;
        if(this.open_time<=0)
        new FireBall(this.playground, this, x, y, radius, vx, vy, speed, color, move_length, this.playground.height*0.01);
    }

    is_attacked(angle, damage){
        for(let i=0;i<15+Math.random()*5;i++){
            let x=this.x, y=this.y;
            let radius=this.radius*Math.random()*0.1;
            let angle=Math.PI*2*Math.random();
            let vx=Math.cos(angle), vy=Math.sin(angle);
            let color=this.color;
            let speed=this.speed*10;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed);
        }

        this.radius-=damage;
        if(this.radius<10){
            this.destroy();
            return(false);
        }
        this.damagex=Math.cos(angle);
        this.damagey=Math.sin(angle);
        this.damage_speed=damage*100;
    }
}
class FireBall extends AcGameObject{
    constructor(playground, player, x, y, radius, vx, vy, speed, color, move_length, damage){
        super();
        this.playground=playground;
        this.player=player;
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.vx=vx;
        this.vy=vy;
        this.speed=speed;
        this.color=color;
        this.ctx=this.playground.game_map.ctx;
        this.move_length=move_length;
        this.eps=0.1;
        this.damage=damage;
    }
    
    start(){

    }

    update(){
        if(this.move_length<this.eps){
            this.destroy();
            return(false);
        }
        else{
            let moved=Math.min(this.move_length, this.speed*this.timedelta/1000);
            this.x+=this.vx*moved;
            this.y+=this.vy*moved;
            this.move_length-=moved;
        }
        for(let i=0;i<this.playground.players.length;i++){
            let cur_player=this.playground.players[i];
            if(this.is_collision(cur_player) && this.player!==cur_player){
                this.attack(cur_player);
            }
        }
        this.render();
    }

    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    get_dist(x1, y1, x2, y2){
        return(Math.sqrt((x1-x2)**2+(y1-y2)**2));
    }

    is_collision(player){
        let distance=this.get_dist(this.x, this.y, player.x, player.y);
        if(distance<=this.radius+player.radius){
            return(true);
        }
        return(false);
    }

    attack(player){
        let angle=Math.atan2(player.y-this.y, player.x-this.x);
        player.is_attacked(angle, this.damage);
        this.destroy();
    }

}
class AcGamePlayground{
    constructor(root){
        this.root=root;
       
        this.$playground = $(`
        <div class="ac-game-playground"></div>
         `);

        this.root.$ac_game.append(this.$playground);

        this.width = this.$playground.width(); // 领域的宽度
        this.height = this.$playground.height(); // 领域的高度

        this.game_map=new GameMap(this);
        this.players=[];
        this.players.push(new Player(this, this.width/2, this.height/2, this.height*0.05, "white", true, this.height*0.15));
        for(let i=0;i<5;i++){
            this.players.push(new Player(this, this.width/2, this.height/2, this.height*0.05, this.get_random_color(), false, this.height*0.15));
        }

        this.$back=this.$playground.find('.ac-game-playground-item-back');
        this.start();
    }

    add_listening_events(){
        let outer=this;
        this.$back.click(function(){
            outer.hide();
            outer.root.$menu.show();
        });
    }

    start(){
        this.hide();
        this.add_listening_events();
    }    

    show(){
        this.$playground.show();
    }

    hide(){
        this.$playground.hide();
    }

    get_random_color(){
        let colors=["red", "green", "blue", "pink", "grey", "orange"];
        let option=Math.floor(Math.random()*6);
        return(colors[option]);
    }
}
class AcGame{
    constructor(id){
        this.id=id;
        this.$ac_game=$('#' + id);
        this.menu=new AcGameMenu(this);
        this.playground=new AcGamePlayground(this);
        this.start();
    }

    start(){

    }
}
