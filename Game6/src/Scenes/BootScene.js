import Fruits from '../Data/Fruits.json'
import Config from '../Data/Config.json'

class BootScene extends Phaser.Scene {
    constructor() {
      super({
        key: 'BootScene'
      });
    }
    preload()
    {

        const ASSETPATH = './'

        this.load.image('title', ASSETPATH + 'assets/images/title.png')
        this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - 10, "Loading...", { 
            fontFamily: 'Arial Black', 
            fontSize: 32, 
            align: 'center'
        }).setDepth(5).setOrigin(.5)
        
        let progress = this.add.graphics()
        this.load.on('progress', function(value){
            progress.clear()
            progress.fillStyle('0xffffff', 1)
            progress.fillRect(this.sys.game.config.width / 2 - 150, this.sys.game.config.height / 2 + 50, 300 * value, 25)
        }, this)

        this.load.on('complete', function() {
            progress.destroy()
        })

        // Load card data
        for(let i = 0; i < Fruits.card.length; i++) {
            this.load.image('card_' + Fruits.card[i].id, ASSETPATH + 'assets/images/card/' + Fruits.card[i].id + '.png')
        }

        this.load.image('title', ASSETPATH + 'assets/images/title.png')

        this.load.image('Box', ASSETPATH + 'assets/images/box.png')
        this.load.image('bg_pattern', ASSETPATH + 'assets/images/bg_pattern.png')
        this.load.image('bg_popup', ASSETPATH + 'assets/images/bg_popup.png')
        this.load.image('bg_popup_title', ASSETPATH + 'assets/images/bg_popup_title.png')
        this.load.image('credits_logo', ASSETPATH + 'assets/images/credits_logo.png')
        this.load.image('title', ASSETPATH + 'assets/images/title.png')
        this.load.image('title_pause', ASSETPATH + 'assets/images/title_pause.png')
        this.load.image('title_result', ASSETPATH + 'assets/images/title_result.png')
        this.load.image('title_credits', ASSETPATH + 'assets/images/title_credits.png')
        this.load.image('btn_play', ASSETPATH + 'assets/images/btn_play.png')
        this.load.image('btn_fullscreen', ASSETPATH + 'assets/images/btn_fullscreen.png')
        this.load.image('btn_sound_off', ASSETPATH + 'assets/images/btn_sound_off.png')
        this.load.image('btn_sound_on', ASSETPATH + 'assets/images/btn_sound_on.png')
        this.load.image('btn_pause', ASSETPATH + 'assets/images/btn_pause.png')
        this.load.image('btn_resume', ASSETPATH + 'assets/images/btn_resume.png')
        this.load.image('btn_menu', ASSETPATH + 'assets/images/btn_menu.png')
        this.load.image('btn_restart', ASSETPATH + 'assets/images/btn_restart.png')
        this.load.image('btn_credits', ASSETPATH + 'assets/images/btn_credits.png')
        this.load.image('d_easy', ASSETPATH + 'assets/images/d_easy.png')
        this.load.image('d_medium', ASSETPATH + 'assets/images/d_medium.png')
        this.load.image('d_hard', ASSETPATH + 'assets/images/d_hard.png')
        let _bgm = Config.Bgm.map(bgm => {
            return ASSETPATH + 'assets/bgm/' + bgm
        })
        this.load.audio('bgm', _bgm)
        this.load.audioSprite('sfx', ASSETPATH + 'assets/sfx/audiosprite.json', [ASSETPATH + 'assets/sfx/audiosprite.ogg', ASSETPATH + 'assets/sfx/audiosprite.mp3'])
    }
    create()
    {
        this.scene.start('SoundScene');
        this.scene.start('BackgroundScene');
        this.scene.start('TitleScene');
    }
}

export default BootScene
