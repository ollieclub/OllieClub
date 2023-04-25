class BackgroundScene extends Phaser.Scene {
    constructor() {
        super({key:'BackgroundScene'})    
    }

    create() {
        let bg = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'bg_pattern')
        bg.setOrigin(0)
    }
}

export default BackgroundScene