export default class DangerNoodle {
    get config() {
        return {
            type: Phaser.AUTO,
            width: 1280,
            height: 1024,
            backgroundColor: '#bfcc80',
            parent: 'danger-noodle',
            scene: {
                preload: this.preload,
                create: this.create,
                update: this.update
            }
        }
    }

    constructor() {
        this.game = new Phaser.Game(this.config)
        this.snake = {};
        this.food = {};
        this.cursors = [];
    }

    preload() {
        this.load.image('snake', 'static/assets/snake.png');
        this.load.image('food', 'static/assets/food.png');
    }

    create() {

        let Food = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize: function food(scene, x, y) {
                Phaser.GameObjects.Image.call(this, scene)

                this.setTexture('food');
                this.setPosition(x * BLOCK_SIZE, y * BLOCK_SIZE);
                this.setOrigin(0);

                this.total = 0;

                scene.children.add(this);
            },

            eat: function () {
                this.total++;

                var x = Phaser.Math.Between(0, 79);
                var y = Phaser.Math.Between(0, 63);

                this.setPosition(x * BLOCK_SIZE, y * BLOCK_SIZE);
            }

        });

        let Snake = new Phaser.Class({
            initialize: function Snake(scene, x, y) {
                this.headPosition = new Phaser.Geom.Point(x, y);
                this.body = scene.add.group();
                this.head = this.body.create(1 + this.headPosition.x * BLOCK_SIZE, 1 + this.headPosition.y * BLOCK_SIZE, 'snake');
                this.head.setOrigin(0);
                this.alive = true;
                this.speed = 100;
                this.moveTime = 0;
                this.heading = RIGHT;
                this.direction = RIGHT;
                this.tail = new Phaser.Geom.Point(x, y);
            },
            update: function (time) {
                if (time >= this.moveTime) {
                    return this.move(time);
                }
            },
            faceLeft: function () {
                if (this.direction === UP || this.direction === DOWN) {
                    this.heading = LEFT;
                }
            },
            faceRight: function () {
                if (this.direction === UP || this.direction === DOWN) {
                    this.heading = RIGHT;
                }
            },
            faceUp: function () {
                if (this.direction === LEFT || this.direction === RIGHT) {
                    this.heading = UP;
                }
            },
            faceDown: function () {
                if (this.direction === LEFT || this.direction === RIGHT) {
                    this.heading = DOWN;
                }
            },
            move: function (time) {
                /**
                 * Based on the heading property (which is the direction the pgroup pressed)
                 * we update the headPosition value accordingly.
                 * 
                 * The Math.wrap call allow the snake to wrap around the screen, so when
                 * it goes off any of the sides it re-appears on the other.
                 */
                switch (this.heading) {
                    case LEFT:
                        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 80);
                        break;

                    case RIGHT:
                        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 80);
                        break;

                    case UP:
                        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 64);
                        break;

                    case DOWN:
                        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 64);
                        break;
                }

                this.direction = this.heading;

                //  Update the body segments
                Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * BLOCK_SIZE, this.headPosition.y * BLOCK_SIZE, 1);

                //  Update the timer ready for the next movement
                this.moveTime = time + this.speed;

                return true;
            },

            grow: function () {
                var newPart = this.body.create(this.tail.x, this.tail.y, 'snake');

                newPart.setOrigin(0);
            },

            collideWithFood: function (food) {
                if (this.head.x === food.x && this.head.y === food.y) {
                    this.grow();

                    food.eat();

                    return true;
                } else {
                    return false;
                }
            }

        });
        this.food = new Food(this, 5, 13);
        this.snake = new Snake(this, 8, 8);

        //  Create our keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(time, delta) {
        if (!this.snake.alive) {
            return;
        }

        /**
         * Check which key is pressed, and then change the direction the snake
         * is heading based on that. The checks ensure you don't double-back
         * on yourself, for example if you're moving to the right and you press
         * the LEFT cursor, it ignores it, because the only valid directions you
         * can move in at that time is up and down.
         */
        if (this.cursors.left.isDown) {
            this.snake.faceLeft();
        } else if (this.cursors.right.isDown) {
            this.snake.faceRight();
        } else if (this.cursors.up.isDown) {
            this.snake.faceUp();
        } else if (this.cursors.down.isDown) {
            this.snake.faceDown();
        }

        if (this.snake.update(time)) {
            this.snake.collideWithFood(this.food);
        }
    }
}

const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;
const BLOCK_SIZE = 16;

let dangerNoodle = new DangerNoodle()