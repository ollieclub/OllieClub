import Config from "../Data/Config.json"

class TitleScene extends Phaser.Scene {
    constructor() {
        super({
          key: 'TitleScene'
        });
    }

    create() {
        this.soundScene = this.scene.get('SoundScene')
        this.GAMESTATE = 'Title'
        this.title = this.add.sprite(this.sys.game.config.width / 2, 200, 'title')
        this.title.setScale(0)
        this.btnPlay = this.add.sprite( this.sys.game.config.width / 2, 700, 'btn_play')
        this.btnPlay.setScale(0)
        this.btnPlay.setInteractive()
        this.btnPlay.on('pointerup', this.playFunction, this)

        if(Config.EnableFullscreenButton) {
            this.btnFullscreen = this.add.sprite( this.sys.game.config.width - 100, this.sys.game.config.height - 20, 'btn_fullscreen')
            this.btnFullscreen.setInteractive()
            this.btnFullscreen.setOrigin(.5, 1)
            this.btnFullscreen.on('pointerup', this.fullscreenFunction, this)
            this.btnFullscreen.on('pointerover', function() {
                this.sys.game._fullscreenfunction = function() {
                    this.canvas[this.device.fullscreen.request]()
                }
            }, this)
            this.btnFullscreen.on('pointerout', function() {
                this.sys.game._fullscreenfunction = null
            }, this)
        }
        
        this.btnCredits = this.add.sprite(0,0 , 'btn_credits')
        this.btnCredits.setInteractive()
        this.btnCredits.setOrigin(.5, 1)
        if(Config.EnableFullscreenButton)
            this.btnCredits.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height- 20)
        else
            this.btnCredits.setPosition(this.sys.game.config.width - 100, this.sys.game.config.height - 20)
            
        this.btnCredits.on('pointerup', this.gotoCredits, this)
        
        this.blackscreen = this.add.graphics()
        this.blackscreen.fillStyle(0x000000, 0.75)
        this.blackscreen.fillRect(0,0, this.sys.game.config.width, this.sys.game.config.height)
        this.blackscreen.setDepth(1)
        this.blackscreen.setVisible(false)
        
        // Create Credits
        this.containerCredits = this.add.container(this.sys.game.config.width / 2, this.sys.game.config.height / 2)
        this.credits = this.add.container(0, 0)
        this.credits.add(this.add.sprite(0,0, 'bg_popup'))
        this.credits.add(this.add.sprite(0, -145, 'bg_popup_title'))
        this.credits.add(this.add.sprite(0, -145, 'title_credits'))
        this.credits.add(this.add.sprite(Config.Credits.Logo.x, Config.Credits.Logo.x, 'credits_logo'))
        this.credits.add(this.add.text(Config.Credits.Text.x, Config.Credits.Text.y, Config.Credits.Text.text, 
        { 
            fontFamily: 'Arial', 
            fontSize: Config.Credits.Text.fontSize, 
            color: Config.Credits.Text.color, 
            align: 'center'
        }).setOrigin(.5))
        
        this.creditsBackMenu = this.add.sprite(0, 200, 'btn_menu')
        this.creditsBackMenu.on('pointerup', this.backToMenu, this)
        this.creditsBackMenu.setScale(.7)
        this.credits.add(this.creditsBackMenu)
        this.containerCredits.add(this.credits)
        this.containerCredits.setDepth(2)
        this.containerCredits.setVisible(false)

        this.btnSound = this.add.sprite( 100, this.sys.game.config.height - 20, 'btn_sound_on')
        let sound = this.soundScene.getSound()
        if(!sound)
            this.btnSound.setTexture('btn_sound_off')
        this.btnSound.setInteractive()
        this.btnSound.setOrigin(.5, 1)
        this.btnSound.on('pointerup', this.setSound, this)

        // Difficulty
        this.btnDifficultyContainer = this.add.container( this.sys.game.config.width / 2, 600)

        this.btndiffEasy = this.add.sprite(0,0, 'd_easy')
        this.btndiffEasy.on('pointerup', ()=>{this.playGame('Easy')}, this)

        this.btndiffMedium = this.add.sprite(0,150, 'd_medium')
        this.btndiffMedium.on('pointerup', ()=>{this.playGame('Medium')}, this)

        this.btndiffHard = this.add.sprite(0,300, 'd_hard')
        this.btndiffHard.on('pointerup', ()=>{this.playGame('Hard')}, this)

        this.btnDifficultyContainer.add(this.btndiffEasy)
        this.btnDifficultyContainer.add(this.btndiffMedium)
        this.btnDifficultyContainer.add(this.btndiffHard)
        this.btnDifficultyContainer.setVisible(false)

        this.startAnimation()

        // Play BGM
        this.soundScene.playBgm("bgm")
    }

    startAnimation() {
        this.soundScene.playSfx('button')
        this.tweens.add({
            targets:this.title,
            scaleX: 1,
            scaleY: 1,
            ease: 'Bounce.easeOut',
            duration: 500,
            onComplete: function(){
                this.tweens.add({
                    targets: this.title,
                    y:230,
                    ease: 'Sine.easeInOut',
                    duration: 2600,
                    yoyo:true,
                    loop:-1
                })
            }.bind(this)
        })
        this.soundScene.playSfx('button', {delay:.3,rate:.5, volume:.7})

        this.tweens.add({
            targets:this.btnPlay,
            scaleX: 1,
            scaleY: 1,
            ease: 'Sine.easeInOut',
            duration: 600,
            delay: 200
        })
    }

    playFunction() {
        if(this.GAMESTATE != 'Title')
            return

        this.soundScene.playSfx('button')
        let this_ = this
        this.tweens.add({
            targets:this.btnPlay,
            scaleX: 0,
            scaleY: 0,
            ease: 'Sine.easeOut',
            duration: 300,
            onComplete: function(){
                this.btnDifficultyContainer.setScale(0).setVisible(true)
                this.tweens.add({
                    targets:this.btnDifficultyContainer,
                    scaleX: 1,
                    scaleY: 1,
                    ease: 'Sine.easeOut',
                    duration: 400,
                    onComplete: function(){
                        this.btndiffEasy.setInteractive()
                        this.btndiffMedium.setInteractive()
                        this.btndiffHard.setInteractive()
                        
                    }.bind(this)
                })
            }.bind(this)
        })
    }

    fullscreenFunction() {
        this.soundScene.playSfx('button')
        this.sys.game.canvas[this.sys.game.device.fullscreen.request]()
    }

    gotoCredits() {
        this.creditsBackMenu.setInteractive()
        this.blackscreen.setVisible(true)
        this.containerCredits.setVisible(true)
        this.GAMESTATE = 'Credits'
        this.soundScene.playSfx('button')
    }
    
    backToMenu() {
        this.creditsBackMenu.disableInteractive()
        this.blackscreen.setVisible(false)
        this.containerCredits.setVisible(false)
        this.GAMESTATE = 'Title'
        this.soundScene.playSfx('button', {rate:.7})
        
    }

    playGame(difficulty) {
        this.soundScene.playSfx('button')
        this.scene.stop('TitleScene')
        this.scene.start('PlayScene', {difficulty:difficulty})
    }

    setSound() {
        let sound = this.soundScene.setSound()
        // Set sound texture
        if(sound){
            this.soundScene.playSfx('button')
            this.btnSound.setTexture('btn_sound_on')
        }
        else
            this.btnSound.setTexture('btn_sound_off')
    }
    
}

export default TitleScene