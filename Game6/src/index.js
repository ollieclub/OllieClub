import 'phaser'
import BootScene from './Scenes/BootScene'
import TitleScene from './Scenes/TitleScene'
import PlayScene from './Scenes/PlayScene'
import BackgroundScene from './Scenes/BackgroundScene'
import SoundScene from './Scenes/SoundScene'



window.onload = function(e){
    let config = {
        type: Phaser.WEBGL,
        parent: 'playscene',
        width: 720,
        height: 1280,
        scene: [
            BootScene,
            SoundScene,
            BackgroundScene,
            TitleScene,
            PlayScene,
        ]
    };
    
    let game = new Phaser.Game(config)
    game._fullscreenfunction = null
    document.getElementById('playscene').addEventListener('click', function(event) {
        if(game._fullscreenfunction != null) game._fullscreenfunction();
    });
}
