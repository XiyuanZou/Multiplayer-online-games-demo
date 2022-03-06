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
