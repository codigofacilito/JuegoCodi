kaboom ({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor:[0.8274509803921568,0.8980392156862745,0.9921568627450981,1],
})

// Sprites Importados 
loadRoot("https://i.imgur.com/")
loadSprite("codi", "vtLik4w.png")
loadSprite("codi2", "JdjJPlK.png")
loadSprite("piso", "EcB1ear.png")
loadSprite("pared", "5sgjtzZ.png")
loadSprite("madera", "WCjIyqZ.png")
loadSprite("madera2", "fyPfGgv.png")
loadSprite("gusanito", "HS0Ojvz.png")
loadSprite("pez", "sq1MFjN.png")
loadSprite("pared2", "DxDVm02.png")
loadSprite("enemigo", "ObxpvXv.png") 

// Variables Globales
let posEnemigo = 50
const numRand = rand(1,5)
const velE = 30
const codiSpeed = 300
const codiJump = 500


// Escena principal
scene("main", ({score, level}) => {
    layers(["obj", "ui"], "obj")

    // Niveles 
    const mapas = [
    [
        "x        s       x",
        "x   ---          x",
        "x                x",
        "x   ---    -     x",
        "x                x",
        "x   -    -   -   x",
        "x                x",
        "x  --       --   x",
        "x                x",
        "=================="
    ],
    [
        "!        >       !",
        "!      _____     !",
        "!                !",
        "!  ___         __!",
        "!                !",
        "!     ____   __  !",
        "!                !",
        "!__       __     !",
        "!                !",
        "=================="
    ]]

    const confg = {
        height: 60, 
        width: 30,
        "=": [sprite("piso"), "piso", solid()],
        "-": [sprite("madera"), "bloque", scale(1.2), solid()],
        "x": [sprite("pared"), "pared", scale(1.5), solid()],
        "s": [sprite("gusanito"), "premio", solid()],
        ">": [sprite("pez"), "premio", solid()],
        "!": [sprite("pared2"), "pared", solid(), scale(1.5)],
        "_": [sprite("madera2"), "bloque", solid()]
    }

    const nivel = addLevel(mapas[level], confg)

    //Spawn de Enemigos
    function spawnE() {
        add([
            sprite("enemigo"),
            pos(posEnemigo, 0),
            scale(1),
            body(),
            "enemigo",
            {
                dir: -1
            }
        ])
    }

    for (let numE=0; numE<=numRand; numE++) {
        spawnE()
        posEnemigo = posEnemigo + (420/numRand)
    }

    action("enemigo", (e) => {
        e.move(e.dir*velE, 0)
        loop(1, () => {
            e.dir = -e.dir
        })
    })

    //Puntuación
    const puntuacionTexto = add([
        text(score),
        pos(80,6),
        layer("ui",),
        {
            value: score
        }
    ])

    add([
        text("level " + "1"),
        pos(100, 6),
        layer("ui")
    ])

    function SCORE() {
        puntuacionTexto.value += 1
        puntuacionTexto.text = puntuacionTexto.value
    }

    // Jugador
    const codi = add([
        sprite("codi"), 
        pos(270, 350),
        scale(1.8),
        body(),
        "player"
    ])

    codi.action(() => {
        camPos(codi.pos)
    })

    // Movimiento de codi con las telcas 
    keyDown("right", () => {
        codi.changeSprite("codi2")
        codi.move(codiSpeed, 0)
    }) 

    keyDown("left", () => {
        codi.changeSprite("codi")
        codi.move(-codiSpeed, 0)
    })

    keyDown("space", () => {
        if (codi.grounded())
        codi.jump(codiJump)
    })

    // Colisiones
    codi.overlaps("enemigo", (e) => {
        go("gameover", {
            score: puntuacionTexto.value
        })
    })

    codi.collides("premio", (p) => {
        destroy(p)
        SCORE(codi)
        go("main", {
            level: (level + 1) % mapas.length, 
            score: puntuacionTexto.value
        })
        posEnemigo = 50
    })
})

// Escena de gameover
scene("gameover", ({score}) => {
    add([
        text("Puntuacion: " + score),
        pos(width()*0.5, height()*0.5),
        scale(1.5)
    ])

    add([
        text("Presiona enter para continuar"),
        pos((width()*0.5)-50, (height()*0.5)+100),
        scale(0.8)
    ])

    keyDown("enter", () =>
    {
        go("main", {
            score: 0,
            level: 0
        })
        posEnemigo = 50
    })
})

start("main", {score:0, level:0})
