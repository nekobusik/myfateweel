let game;

let gameOptions = {

    // slices configuration
    slices: [
        {
            degrees: 72,
            startColor: 0xC0AFEA,
            endColor: 0x674EA7,
            rings: 10,
            sliceText: "Try",
            sliceTextStyle: {
                fontFamily: "Packard Antique Bold",
                fontSize: 50
            },
            text: "Try"
        },
        {
            degrees: 72,
            startColor: 0xB6D7A8,
            endColor: 0x38761D,
            rings: 10,
            sliceText: "May be",
            sliceTextStyle: {
                fontFamily: "Packard Antique Bold",
                fontSize: 50
            },
            text: "May be"
        },
        {
            degrees: 72,
            startColor: 0x9FC5E8,
            endColor: 0x0B5394,
            rings: 10,
            text: "Very soon",
            sliceText: "Very soon",
            sliceTextStyle: {
                fontFamily: "Packard Antique Bold",
                fontSize: 50
            },
        },
        {
            degrees: 72,
            startColor: 0xEAD1DC,
            endColor: 0xA64D79,
            rings: 10,
            text: "Yes!",
            sliceText: "Yes!",
            sliceTextStyle: {
                fontFamily: "Packard Antique Bold",
                fontSize: 50
            },
        },
        {
            degrees: 72,
            startColor: 0xCCCCCC,
            endColor: 0x000000,
            rings: 10,
            text: "Never!",
            sliceText: "Never!",
            sliceTextStyle: {
                fontFamily: "Packard Antique Bold",
                fontSize: 50
            },
        }
    ],

    // wheel rotation duration range, in milliseconds
    rotationTimeRange: {
        min: 3000,
        max: 4500
    },

    // wheel rounds before it stops
    wheelRounds: {
        min: 2,
        max: 11
    },

    // degrees the wheel will rotate in the opposite direction before it stops
    backSpin: {
        min: 1,
        max: 4
    },

    // wheel radius, in pixels
    wheelRadius: 240,

    // color of stroke lines
    strokeColor: 0xffffff,

    // width of stroke lines
    strokeWidth: 5
}

// once the window loads...
window.onload = function () {

    // game configuration object
    let gameConfig = {

        // resolution and scale mode
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 853,
            height: 1280
        },

        // game background color
        //   backgroundColor: 0x000000,

        // scenes used by the game
        scene: [playGame]
    };

    // game constructor
    game = new Phaser.Game(gameConfig);

    // pure javascript to give focus to the page/frame
    window.focus()
}

// PlayGame scene
class playGame extends Phaser.Scene {

    // constructor
    constructor() {
        super("PlayGame");
    }

    // method to be executed when the scene preloads
    preload() {

        // loading pin image
        this.load.image("pin", "pin.png");
        this.load.image("back", "back.png");
    }

    // method to be executed once the scene has been created
    create() {
        this.add.image(0.5, 0.5, 'back').setOrigin(0);

        // starting degrees
        let startDegrees = -90;

        // making a graphic object without adding it to the game
        let graphics = this.make.graphics({
            x: 0,
            y: 0,
            add: false
        });


        // adding a container to group wheel and icons
        this.wheelContainer = this.add.container(game.config.width / 2, game.config.height / 2);

        // array which will contain all icons
        let iconArray = [];

        // looping through each slice
        for (let i = 0; i < gameOptions.slices.length; i++) {

            // converting colors from 0xRRGGBB format to Color objects
            let startColor = Phaser.Display.Color.ValueToColor(gameOptions.slices[i].startColor);
            let endColor = Phaser.Display.Color.ValueToColor(gameOptions.slices[i].endColor)

            for (let j = gameOptions.slices[i].rings; j > 0; j--) {

                // interpolate colors
                let ringColor = Phaser.Display.Color.Interpolate.ColorWithColor(startColor, endColor, gameOptions.slices[i].rings, j);

                // converting the interpolated color to 0xRRGGBB format
                let ringColorString = Phaser.Display.Color.RGBToString(Math.round(ringColor.r), Math.round(ringColor.g), Math.round(ringColor.b), 0, "0x");

                // setting fill style
                graphics.fillStyle(ringColorString, 1);

                // drawing the slice
                graphics.slice(gameOptions.wheelRadius + gameOptions.strokeWidth, gameOptions.wheelRadius + gameOptions.strokeWidth, j * gameOptions.wheelRadius / gameOptions.slices[i].rings, Phaser.Math.DegToRad(startDegrees), Phaser.Math.DegToRad(startDegrees + gameOptions.slices[i].degrees), false);

                // filling the slice
                graphics.fillPath();
            }

            // setting line style
            graphics.lineStyle(gameOptions.strokeWidth, gameOptions.strokeColor, 0.5);

            // drawing the biggest slice
            graphics.slice(gameOptions.wheelRadius + gameOptions.strokeWidth, gameOptions.wheelRadius + gameOptions.strokeWidth, gameOptions.wheelRadius, Phaser.Math.DegToRad(startDegrees), Phaser.Math.DegToRad(startDegrees + gameOptions.slices[i].degrees), false);

            // stroking the slice
            graphics.strokePath();


            // add slice text, if any
            if (gameOptions.slices[i].sliceText != undefined) {

                // the text
                let text = this.add.text(gameOptions.wheelRadius * 0.75 * Math.cos(Phaser.Math.DegToRad(startDegrees + gameOptions.slices[i].degrees / 2)), gameOptions.wheelRadius * 0.75 * Math.sin(Phaser.Math.DegToRad(startDegrees + gameOptions.slices[i].degrees / 2)), gameOptions.slices[i].sliceText, gameOptions.slices[i].sliceTextStyle);

                // set text origin to its center
                text.setOrigin(0.5);

                // set text angle
                text.angle = startDegrees + gameOptions.slices[i].degrees / 2 + 90;

                // stroke text, if required
                if (gameOptions.slices[i].sliceTextStroke && gameOptions.slices[i].sliceTextStrokeColor) {
                    text.setStroke(gameOptions.slices[i].sliceTextStrokeColor, gameOptions.slices[i].sliceTextStroke);
                }

                // add text to iconArray
                iconArray.push(text);
            }

            // updating degrees
            startDegrees += gameOptions.slices[i].degrees;

        }

        graphics.generateTexture("wheel", (gameOptions.wheelRadius + gameOptions.strokeWidth) * 2, (gameOptions.wheelRadius + gameOptions.strokeWidth) * 2);

        let wheel = this.add.sprite(0, 0, "wheel");

        this.wheelContainer.add(wheel);

        this.wheelContainer.add(iconArray);

        this.pin = this.add.sprite(game.config.width / 2, game.config.height / 2, "pin");

        this.prizeText = this.add.text(game.config.width / 2, game.config.height / 6 - 20, "Think about your question. \n Spin the wheel", {
            font: "50px Packard Antique Bold", 
            align: "center",
            color: "white"
        });

        this.prizeText.setOrigin(0.5);

        this.canSpin = true;

        this.input.on("pointerdown", this.spinWheel, this);
    }

    spinWheel() {

        if (this.canSpin) {
            this.prizeText.setText("");
            let rounds = Phaser.Math.Between(gameOptions.wheelRounds.min, gameOptions.wheelRounds.max);
            let degrees = Phaser.Math.Between(0, 360);
            let backDegrees = Phaser.Math.Between(gameOptions.backSpin.min, gameOptions.backSpin.max);

            let prizeDegree = 0;

            for (let i = gameOptions.slices.length - 1; i >= 0; i--) {

                prizeDegree += gameOptions.slices[i].degrees;

                if (prizeDegree > degrees - backDegrees) {

                    var prize = i;
                    break;
                }
            }

            this.canSpin = false;

            this.tweens.add({

                targets: [this.wheelContainer],

                angle: 360 * rounds + degrees,

                duration: Phaser.Math.Between(gameOptions.rotationTimeRange.min, gameOptions.rotationTimeRange.max),

                ease: "Cubic.easeOut",

                callbackScope: this,

                onComplete: function (tween) {

                    this.tweens.add({
                        targets: [this.wheelContainer],
                        angle: this.wheelContainer.angle - backDegrees,
                        duration: Phaser.Math.Between(gameOptions.rotationTimeRange.min, gameOptions.rotationTimeRange.max) / 2,
                        ease: "Cubic.easeIn",
                        callbackScope: this,
                        onComplete: function (tween) {

                            this.prizeText.setText(gameOptions.slices[prize].text);

                            this.canSpin = true;
                        }
                    })
                }
            });
        }
    }
}
