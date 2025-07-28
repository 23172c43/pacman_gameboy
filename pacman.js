class Pacman{
    constructor(x, y, width, height, speed){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = speed
        this.direction = DIRECTION_RIGHT
        this.nextDirection = this.direction
        this.currentFrame = 1
        this.frameCount = 7

        setInterval(
            () => {
                this.changeAnimation()
            },
            100
        )
    }

    moveProcess(){
        this.changeDirectionIfImpossible()
        this.moveForwards()

        if(this.checkColission()){
            this.moveBackwards()
        }

        this.handleMapWrapAround()
    }

    handleMapWrapAround() {
        // Nếu đi ra trái ngoài bản đồ
        if (this.x < -this.width) {
            this.x = map[0].length * oneBlockSize
        }
    
        // Nếu đi ra phải ngoài bản đồ
        if (this.x > map[0].length * oneBlockSize) {
            this.x = -this.width
        }
    
        // (Tuỳ chọn) Nếu bạn muốn wrap trên/dưới thì có thể thêm:
        // if (this.y < -this.height) {
        //     this.y = map.length * oneBlockSize
        // }
        // if (this.y > map.length * oneBlockSize) {
        //     this.y = -this.height
        // }
    }

    eat(){
        for(let i = 0; i < map.length; i++){
            for(let j = 0; j < map[0].length; j++){
                if(map[i][j] == 2 && this.getMapX() == j && this.getMapY() == i){
                    map[i][j] = 3
                    score++
                }
            }
        }
    }

    moveBackwards(){
        switch(this.direction){
            case DIRECTION_RIGHT:
                this.x -= this.speed
                break

            case DIRECTION_LEFT:
                this.x += this.speed
                break

            case DIRECTION_BOTTOM:
                this.y -= this.speed
                break

            case DIRECTION_UP:
                this.y += this.speed
                break
        }
    }

    moveForwards(){
        switch(this.direction){
            case DIRECTION_RIGHT:
                this.x += this.speed
                break

            case DIRECTION_LEFT:
                this.x -= this.speed
                break

            case DIRECTION_BOTTOM:
                this.y += this.speed
                break

            case DIRECTION_UP:
                this.y -= this.speed
                break
        }
    }

    checkColission(){
        let isCollided = false
        
        if(map[this.getMapY()][this.getMapX()] == 1
        || map[this.getMapYRightSide()][this.getMapX()] == 1
        || map[this.getMapY()][this.getMapXRightSide()] == 1
        || map[this.getMapYRightSide()][this.getMapXRightSide()] == 1
        ) {
            return true
        }

        return false
    }

    checkGhostCollision(){
        for(let i = 0; i < ghosts.length; i++){
            let ghost = ghosts[i]
            if(ghost.getMapX() == this.getMapX() && this.getMapY() == ghost.getMapY()){
                return true
            }
        }

        return false
    }

    changeDirectionIfImpossible(){
        if(this.direction == this.nextDirection) return

        let tempDirection = this.direction
        this.direction = this.nextDirection

        this.moveForwards()

        if(this.checkColission()){
            this.moveBackwards();
            this.direction = tempDirection
        } else {
            this.moveBackwards()
        }
    }

    changeAnimation(){
        this.currentFrame = (this.currentFrame % this.frameCount) + 1;
    }

    draw() {
        canvasContext.save();
        canvasContext.translate(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2
        );
        canvasContext.rotate((this.direction * 90 * Math.PI) / 180);
        canvasContext.translate(
            -this.x - oneBlockSize / 2,
            -this.y - oneBlockSize / 2
        );
        canvasContext.drawImage(
            pacmanFrames,
            (this.currentFrame - 1) * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            this.x,
            this.y,
            this.width,
            this.height
        );

        
        canvasContext.restore();
    }

    getMapX(){
        return parseInt(this.x / oneBlockSize)
    }

    getMapY(){
        return parseInt(this.y / oneBlockSize)
    }

    getMapXRightSide(){
        return parseInt((this.x + 0.9999 * oneBlockSize) / oneBlockSize)
    }

    getMapYRightSide(){
        return parseInt((this.y + 0.9999 * oneBlockSize) / oneBlockSize)
    }
}