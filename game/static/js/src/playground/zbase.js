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
