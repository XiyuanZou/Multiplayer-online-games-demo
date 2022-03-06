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
