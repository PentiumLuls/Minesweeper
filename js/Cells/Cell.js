function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.opened = false;
    this.flagged = false;
    this.type = empty
}

Cell.prototype.draw = function (ctx, cellSize) {
    const spritesheet = new Image();
    spritesheet.src = 'img/spritesheet.png';
    if (this.opened === true) {
        ctx.drawImage(spritesheet, this.type.pixelsLeft, this.type.pixelsTop, this.type.spriteWidth, this.type.spriteHeight,
            this.x, this.y, cellSize, cellSize
        );
    } else if (this.flagged) {
        ctx.drawImage(spritesheet, flag.pixelsLeft, flag.pixelsTop, flag.spriteWidth, flag.spriteHeight,
            this.x, this.y, cellSize, cellSize
        );
    }
    else {
        ctx.drawImage(spritesheet, hiden.pixelsLeft, hiden.pixelsTop, hiden.spriteWidth, hiden.spriteHeight,
            this.x, this.y, cellSize, cellSize
        );
    }
};