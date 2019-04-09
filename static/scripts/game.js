var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 1024,
    backgroundColor: '#bfcc00',
    parent: 'danger-noodle',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var snake;
var cursors;

//  Direction consts
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;
const BLOCK_SIZE = 8;

function preload () {
    this.load.image('snake', 'assets/snake.png');
}

function create () {
    var Snake = new Phaser.Class({

        initialize:

        function Snake (scene, x, y)
        {
            this.headPosition = new Phaser.Geom.Point(x, y);

            this.body = scene.add.group();

            this.head = this.body.create(this.headPosition.x * BLOCK_SIZE, this.headPosition.y * BLOCK_SIZE, 'body');
            debugger;
            this.head.setOrigin(0);

            this.alive = true;

            this.speed = 66;

            this.moveTime = 0;

            this.heading = RIGHT;
            this.direction = RIGHT;
        },

        update: function (time)
        {
            if (time >= this.moveTime)
            {
                return this.move(time);
            }
        },

        faceLeft: function ()
        {
            if (this.direction === UP || this.direction === DOWN)
            {
                this.heading = LEFT;
            }
        },

        faceRight: function ()
        {
            if (this.direction === UP || this.direction === DOWN)
            {
                this.heading = RIGHT;
            }
        },

        faceUp: function ()
        {
            if (this.direction === LEFT || this.direction === RIGHT)
            {
                this.heading = UP;
            }
        },

        faceDown: function ()
        {
            if (this.direction === LEFT || this.direction === RIGHT)
            {
                this.heading = DOWN;
            }
        },

        move: function (time)
        {
            /**
            * Based on the heading property (which is the direction the pgroup pressed)
            * we update the headPosition value accordingly.
            * 
            * The Math.wrap call allow the snake to wrap around the screen, so when
            * it goes off any of the sides it re-appears on the other.
            */
            switch (this.heading)
            {
                case LEFT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 159);
                    break;

                case RIGHT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 159);
                    break;

                case UP:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 127);
                    break;

                case DOWN:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 127);
                    break;
            }

            this.direction = this.heading;

            //  Update the body segments
            Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * BLOCK_SIZE, this.headPosition.y * BLOCK_SIZE, 1);

            //  Update the timer ready for the next movement
            this.moveTime = time + this.speed;

            return true;
        }

    });

    snake = new Snake(this, 8, 8);

    //  Create our keyboard controls
    cursors = this.input.keyboard.createCursorKeys();
}

function update (time, delta)
{
    if (!snake.alive)
    {
        return;
    }

    /**
    * Check which key is pressed, and then change the direction the snake
    * is heading based on that. The checks ensure you don't double-back
    * on yourself, for example if you're moving to the right and you press
    * the LEFT cursor, it ignores it, because the only valid directions you
    * can move in at that time is up and down.
    */
    if (cursors.left.isDown)
    {
        snake.faceLeft();
    }
    else if (cursors.right.isDown)
    {
        snake.faceRight();
    }
    else if (cursors.up.isDown)
    {
        snake.faceUp();
    }
    else if (cursors.down.isDown)
    {
        snake.faceDown();
    }

    snake.update(time);
}
