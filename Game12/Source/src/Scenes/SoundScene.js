class SoundScene extends Phaser.Scene {
    constructor() {
        super({key:'SoundScene'})    
    }

    create() {
        this.soundGame = localStorage.getItem('fruit_sound')
        if(this.soundGame === null)
            this.soundGame = true
        else
            this.soundGame = (this.soundGame === "true")
    }

    playSfx(name, configSound = {}) {
        if(this.soundGame)
            this.sound.playAudioSprite('sfx', name, configSound)
    }

    playBgm(name) {
        if(this.bgm === undefined)
            this.bgm = this.sound.add(name, {loop:true})

        if(name !== this.bgm.key) {
            this.bgm.stop()
            this.bgm.play(name, {loop:true})
        }
        
        if(this.soundGame)
            if(!this.bgm.isPlaying)
                this.bgm.play()
    }
    setSound() {
        this.soundGame = !this.soundGame
        if(!this.soundGame)
            this.bgm.stop()
        else
            this.bgm.play()
        
        localStorage.setItem('fruit_sound', this.soundGame)
        return this.soundGame
        
    }

    getSound() {
        return this.soundGame
    }
}

export default SoundScene