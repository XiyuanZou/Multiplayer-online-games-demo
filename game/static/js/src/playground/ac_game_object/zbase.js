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
