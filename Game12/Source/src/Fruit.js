export default class Fruit extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key)   
        config.scene.add.existing(this)
        this.setInteractive()
        this.fruitTexture = config.fruitTexture
        this.on('pointerdown', (pointer, x, y) => {
            this.fruitInteracted(x, y)
        })
        this.opened = false
        this.sizeTexture = config.setSize || 200
        this.scaleTexture = this.sizeTexture / 200
        this.setDisplaySize(this.sizeTexture, this.sizeTexture)
        this.setScale(0)
        this.soundScene = this.scene.scene.get('SoundScene')
        
    }
    
    scaleInAnimation(delay) {
        this.scene.tweens.add({
            targets: this,
            scaleX: this.scaleTexture,
            scaleY: this.scaleTexture,
            ease: 'Sine.easeInOut',
            duration: 280,
            delay: delay,
            onStart:function(){
                this.scene.soundScene.playSfx('button',{rate:.3,volume:.5,delay:delay / 1000})
            }.bind(this)
        })
    }

    fruitInteracted(x, y) {
        if(this.opened || this.scene.selected.length >= 2 || this.scene.GAMESTATE != 'Play')
            return
        
        this.opened = true
        this.scene.selected.push(this)
        this.flipOpenTransition()

        if(this.scene.selected.length >= 2)
            this.scene.checkCombination()
    }

    setClosed() {
        this.flipCloseTransition()
        this.opened = false
    }

    reset() {
        this.opened = false
        this.setTexture('Box')
    }

    flipOpenTransition() {
        this.soundScene.playSfx('card_flip_open')
        let this_ = this
        this.scene.tweens.timeline({

            targets: this,
            ease: 'Linear',
            duration: this.scene.config.Animation.CardTweenSpeed,
    
            tweens: [{
                scaleX: 0,
                onComplete: function() {
                    this_.setTexture(this_.fruitTexture)
                }
            },
            {
                scaleX: this.scaleTexture,
                delay: 15
            }]
    
        })
    }

    flipCloseTransition() {
        this.soundScene.playSfx('card_flip_close')
        let this_ = this
        this.scene.tweens.timeline({

            targets: this,
            ease: 'Linear',
            duration: this.scene.config.Animation.CardTweenSpeed,
    
            tweens: [{
                scaleX: 0,
                onComplete: function() {
                    this_.setTexture('Box')
                }
            },
            {
                scaleX: this.scaleTexture,
                delay: 15
            }]
    
        })
    }
}