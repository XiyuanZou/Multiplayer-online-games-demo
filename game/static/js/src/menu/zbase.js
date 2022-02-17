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
