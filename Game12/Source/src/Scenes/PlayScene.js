import Config from '../Data/Config.json'
import Fruits from '../Data/Fruits.json'
import Fruit from '../Fruit';

class PlayScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'PlayScene'
        })
    }
    
    init(data) {
        this.difficulty = data.difficulty
    }

    create() {
        this.soundScene = this.scene.get('SoundScene')
        this.GAMESTATE = 'Play'
        this.config = Config
        this.blockLeft = 0
        this.score = 0
        this.chance = 0

        this.blackscreen = this.add.graphics()
        this.blackscreen.fillStyle(0x000000, 0.75)
        this.blackscreen.fillRect(0,0, this.sys.game.config.width, this.sys.game.config.height)

        this.blackscreenResult = this.add.graphics()
        this.blackscreenResult.fillStyle(0x000000, 0.75)
        this.blackscreenResult.fillRect(0,0 , this.sys.game.config.width, this.sys.game.config.height)
        this.blackscreenResult.setDepth(1)
        this.blackscreenResult.setVisible(false)

        // Result Screen
        this.resultContainer = this.add.container(this.sys.game.config.width / 2, this.sys.game.config.height / 2)
        this.resultContainer.add(this.add.sprite( 0, 0, 'bg_popup'))
        this.resultContainer.add(this.add.sprite( 0, -145, 'bg_popup_title'))
        this.resultContainer.add(this.add.sprite( 0, -145, 'title_result'))
        let textResultScore = this.add.text(0, -100, "Score", 
        { 
            fontFamily: 'Arial Black', 
            fontSize: 32, 
            color: '#00ff00', 
            align: 'center'
        }
        ).setOrigin(.5, 0).setStroke('#EAFFEA', 10)
        this.resultContainer.add(textResultScore)
        this.resultText = this.add.text(0, -30, "9999", 
        { 
            fontFamily: 'Arial Black', 
            fontSize: 82, 
            color: '#FF6138', 
            align: 'center'
        }
        ).setOrigin(.5, 0).setStroke('#EAFFEA', 10)
        this.resultBtnRestart = this.add.sprite( 100, 200, "btn_restart")
        this.resultBtnRestart.setScale(.8)
        this.resultBtnRestart.on('pointerdown', this.restart, this)
        this.resultBtnMenu = this.add.sprite( -100, 200, "btn_menu")
        this.resultBtnMenu.setScale(.8)
        this.resultBtnMenu.on('pointerdown', this.backToMenu, this)
        this.resultContainer.add([this.resultText, this.resultBtnRestart, this.resultBtnMenu])
        this.resultContainer.setDepth(2)
        this.resultContainer.setVisible(false)

        // Pause Screen
        this.pauseContainer = this.add.container()
        this.pauseContainer.add(this.blackscreen)
        this.pauseContainer.setDepth(1)
        this.pauseTitle = this.add.sprite(this.sys.game.config.width / 2, (this.sys.game.config.height / 2) - 100, 'title_pause')
        this.pauseBtnResume = this.add.sprite(this.pauseTitle.x + 200, this.pauseTitle.y + 120, 'btn_resume')
        this.pauseBtnResume.setScale(.6)
        this.pauseBtnResume.on('pointerdown', this.resume, this)
        this.pauseBtnRestart = this.add.sprite(this.pauseTitle.x, this.pauseTitle.y + 120, 'btn_restart')
        this.pauseBtnRestart.setScale(.6)
        this.pauseBtnRestart.on('pointerdown', this.restart, this)
        this.pauseBtnMenu = this.add.sprite(this.pauseTitle.x - 200, this.pauseTitle.y + 120, 'btn_menu')
        this.pauseBtnMenu.setScale(.6)
        this.pauseBtnMenu.on('pointerdown', this.backToMenu, this)
        this.pauseContainer.add(this.pauseTitle)
        this.pauseContainer.add(this.pauseBtnResume)
        this.pauseContainer.add(this.pauseBtnRestart)
        this.pauseContainer.add(this.pauseBtnMenu)
        this.pauseContainer.setVisible(false)

        this.add.text( this.sys.game.config.width / 2, 10, "Score", 
            { 
                fontFamily: 'Arial Black', 
                fontSize: 42, 
                color: '#00ff00', 
                align: 'center'
            }
        ).setOrigin(.5, 0).setStroke('#EAFFEA', 10)
        this.scoreText = this.add.text( this.sys.game.config.width / 2, 80, "0", 
            { 
                fontFamily: 'Arial Black', 
                fontSize: 82, 
                color: '#00ff00', 
                align: 'center'
            }
        ).setOrigin(.5, 0).setStroke('#EAFFEA', 10)
        this.add.text( this.sys.game.config.width / 2, this.sys.game.config.height - 100, "Chance", 
            { 
                fontFamily: 'Arial Black', 
                fontSize: 42, 
                color: '#00ff00', 
                align:'center'
            }
        ).setOrigin(.5, 1).setStroke('#EAFFEA', 10)
        this.chanceText = this.add.text( this.sys.game.config.width / 2, this.sys.game.config.height - 10, "0", 
            { 
                fontFamily: 'Arial Black', 
                fontSize: 72, 
                color: '#00ff00', 
                align:'center'
            }
        ).setOrigin(.5, 1).setStroke('#EAFFEA', 10)
        this.playData = {}

        this.btnPause = this.add.sprite(this.sys.game.config.width - 20, 20, 'btn_pause')
        this.btnPause.setOrigin(1,0)
        this.btnPause.setScale(.5)
        this.btnPause.setInteractive()
        this.btnPause.on('pointerdown', this.pause, this)

        this.createFruitsGroup()
        this.startCardAnimation()
        this.selected = []
        this.wrongAnswer = false
        this.wrongDelay = 0

    }

    checkCombination() {
        let fruitTexture = this.selected[0].fruitTexture
        let isSameType = this.selected.every(item => item.fruitTexture == fruitTexture)
        if(!isSameType)
        {
            this.wrongAnswer = true
            this.wrongDelay = this.config.DelayWrongCard;
            this.chance--
            this.updateChanceText()
            if(this.chance <= 0)
                this.showResult()
        } else {
            this.soundScene.playSfx('right_answer')
            
            this.score += this.config.DefaultScore
            // update score
            this.updateScoreText()

            this.blockLeft--
            this.selected = []
            if(this.blockLeft <= 0 ) {
                setTimeout(this.endCardAnimation.bind(this), 700)
            }
        }
        
    }
    updateChanceText() {
        this.chanceText.setText(this.chance.toString())
    }
    updateScoreText() {
        this.scoreText.setText(this.score.toString())
    }
    stopWrongDelay() {
        this.selected.forEach(item => item.setClosed())
        this.wrongAnswer = false
        this.selected = []
    }

    createFruitsGroup() {
        this.fruitsGroup = this.add.group()
        this.fruitsContainer = this.add.container()

        this.playData = Object.assign({},this.config.Difficulty[this.difficulty])
        this.chance = this.playData.chance
        this.blockLeft = this.playData.totalBox / 2
        // set chance text
        this.updateChanceText()

        let _fruits = Fruits.card.slice()

        for(let i = 0; i < this.playData.totalBox / 2; i++) {
            let fruitTexture = "card_" + _fruits.splice(Phaser.Math.Between(0, _fruits.length - 1) ,1)[0].id
            this.fruitsGroup.add(
                new Fruit({
                    scene: this,
                    key: 'Box',
                    fruitTexture: fruitTexture,
                    setSize: this.playData.sizeBox
                })
            )

            this.fruitsGroup.add(
                new Fruit({
                    scene: this,
                    key: 'Box',
                    fruitTexture: fruitTexture,
                    setSize: this.playData.sizeBox
                })
            )
        }
        // Set offset grid because, set position grid do nothing
        this.playData.gridPosition = Object.assign({},this.playData.grid)

        this.playData.gridPosition.x = -((this.playData.grid.width / 2 ) * this.playData.grid.cellWidth ) + (this.playData.grid.cellWidth / 2) + this.playData.grid.x
        this.playData.gridPosition.y = -((this.playData.grid.width / 2 ) * this.playData.grid.cellWidth ) + (this.playData.grid.cellWidth / 2) + this.playData.grid.y
        // Phaser.Actions.Shuffle(this.fruitsGroup.getChildren())
        this.fruitsContainer.add(this.fruitsGroup.getChildren())
        this.fruitsContainer.shuffle()
        
        Phaser.Actions.GridAlign(this.fruitsContainer.getAll(), this.playData.gridPosition)
        this.fruitsContainer.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height / 2)
        
    }

    startCardAnimation() {
        let childCount = 0
        this.fruitsGroup.children.iterate((child) => {
            child.scaleInAnimation(childCount * 60)
            childCount++
        }, this)
    }

    endCardAnimation() {
        let childCount = 0
        let this_ = this
        this.fruitsGroup.children.iterate((child) => {
            let onComplete = null
            if(childCount >= this.fruitsGroup.getLength() - 1) {
                onComplete = function() {
                    this_.nextLevel()
                }
            }
            this.tweens.add({
                targets: child,
                scaleX: 0,
                scaleY: 0,
                ease: 'Sine.easeInOut',
                duration: 280,
                delay: childCount * 40,
                onComplete: onComplete
            })
            childCount++
        }, this)
    }
    
    nextLevel() {
        this.blockLeft = this.playData.totalBox / 2
        this.chance += this.playData.bonusNextLvlChance
        this.updateChanceText()
        this.selected = []
        let _fruits = Fruits.card.slice()
        let match = 0
        let fruitTexture = null
        this.fruitsGroup.children.iterate((child) => {
            if(match == 0) {
                fruitTexture = "card_" + _fruits.splice(Phaser.Math.Between(0, _fruits.length - 1) ,1)[0].id
                match = 2
            }

            child.fruitTexture = fruitTexture
            child.reset()
            match--
        })
        this.fruitsContainer.shuffle()

        Phaser.Actions.GridAlign(this.fruitsContainer.getAll(), this.playData.gridPosition)

        this.startCardAnimation()
    }

    pause() {
        if(this.GAMESTATE != 'Play')
            return
        
        this.soundScene.playSfx('button')
            
        this.GAMESTATE = 'Pause'

        this.pauseBtnMenu.setInteractive()
        this.pauseBtnRestart.setInteractive()
        this.pauseBtnResume.setInteractive()

        this.pauseContainer.setVisible(true)
    }

    resume() {
        if(this.GAMESTATE != 'Pause')
            return

        this.soundScene.playSfx('button', {rate:.7})

        this.GAMESTATE = 'Play'

        this.pauseBtnMenu.disableInteractive()
        this.pauseBtnRestart.disableInteractive()
        this.pauseBtnResume.disableInteractive()

        this.pauseContainer.setVisible(false)
    }

    backToMenu() {
        this.soundScene.playSfx('button', {rate:.7})
        this.scene.stop('PlayScene')
        this.scene.start('TitleScene');
    }

    restart() {
        this.soundScene.playSfx('button')
        this.pauseBtnMenu.disableInteractive()
        this.pauseBtnRestart.disableInteractive()
        this.pauseBtnResume.disableInteractive()

        this.resultContainer.setVisible(false)
        this.blackscreenResult.setVisible(false)
        this.resultBtnMenu.disableInteractive()
        this.resultBtnRestart.disableInteractive()

        this.pauseContainer.setVisible(false)

        this.fruitsContainer.destroy(true)
        this.createFruitsGroup()
        this.startCardAnimation()
        this.selected = []
        this.wrongAnswer = false
        this.wrongDelay = 0
        this.GAMESTATE = 'Play'
        this.score = 0
        this.scoreText.setText("0")
    }

    showResult() {
        this.GAMESTATE = 'Result'

        this.resultText.setText(this.score.toString())
        this.soundScene.playSfx('win')
        this.resultContainer.setVisible(true)
        this.blackscreenResult.setVisible(true)
        this.resultBtnMenu.setInteractive()
        this.resultBtnRestart.setInteractive()
        
        this.resultContainer.setY(-200)
        this.tweens.add({
            targets:this.resultContainer,
            y:this.sys.game.config.height/2,
            duration:1000,
            ease: 'Quart.easeOut'
            
        })
    }
    
    update(time, delta) {
        if(this.wrongAnswer == true) {
            if(this.wrongDelay >= 0) 
                this.wrongDelay -= delta / 1000
            else
                this.stopWrongDelay()
        } 
    }
}

export default PlayScene
