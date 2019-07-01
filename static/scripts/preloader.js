class Preloader extends Phaser.Scene {
    constructor() {
        super({key: 'preloader'});
    }

    static get active() {
        return  true;
    };

    preload() {
        console.log(`preloader`);
        this.load.image('snake', 'static/assets/snake.png');
        console.log(`preloading done`);
    }
}

export default Preloader;