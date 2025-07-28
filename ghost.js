class Ghost{
    constructor(x, y, width, height, speed, imageX, imageY, imageWidth, imageHeight, range){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = speed
        this.direction = DIRECTION_RIGHT
        this.imageX = imageX
        this.imageY = imageY
        this.imageHeight = imageHeight
        this.imageWidth = imageWidth
        this.range = range
        this.randomTargetIndex = parseInt(Math.random() * randomTargetForGhosts.length)

        setInterval(() => {
            this.changeRandomDirection()
        }, 10000 / 2)
    }

    changeRandomDirection(){
        this.randomTargetIndex += 1
        this.randomTargetIndex = this.randomTargetIndex % 4
    }

    moveProcess(){
        if(this.isInRangeOfPacman()){
            this.target = pacman
        } else {
            this.target = randomTargetForGhosts[this.randomTargetIndex]
        }

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
        
    }

    isInRangeOfPacman(){
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX())
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY())

        if(Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range){
            return true
        }

        return false
    }

    changeDirectionIfImpossible(){
        let tempDirection = this.direction

        this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x / oneBlockSize),
            parseInt(this.target.y / oneBlockSize)
        )

        if(typeof this.direction == 'undefined'){
            this.direction = tempDirection
            return
        }



        this.moveForwards()

        if(this.checkColission()){
            this.moveBackwards();
            this.direction = tempDirection
        } else {
            this.moveBackwards()
        }
    }

    calculateNewDirection(map, destX, destY){
        let mp = []

        for(let i = 0; i < map.length; i++){
            mp[i] = map[i].slice()
        }

        let queue = [
            {
                x: this.getMapX(),
                y: this.getMapY(),
                moves: []
            }
        ]

        while(queue.length > 0){
            let poped = queue.shift()
            if(poped.x == destX && poped.y == destY){
                return poped.moves[0]
            } else {
                mp[poped.y][poped.x] = 1
                let neightborList = this.addNeighbors(poped, mp);

                for(let i = 0; i < neightborList.length; i++){
                    queue.push(neightborList[i])
                }
            }

            
        }

        return DIRECTION_UP //default
    }

    addNeighbors(poped, mp) {
        let queue = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;

        if (
            poped.x - 1 >= 0 &&
            poped.x - 1 < numOfRows &&
            mp[poped.y][poped.x - 1] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_LEFT);
            queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
        }
        if (
            poped.x + 1 >= 0 &&
            poped.x + 1 < numOfRows &&
            mp[poped.y][poped.x + 1] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_RIGHT);
            queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
        }
        if (
            poped.y - 1 >= 0 &&
            poped.y - 1 < numOfColumns &&
            mp[poped.y - 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_UP);
            queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
        }
        if (
            poped.y + 1 >= 0 &&
            poped.y + 1 < numOfColumns &&
            mp[poped.y + 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_BOTTOM);
            queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
        }
        return queue;
    }

    changeAnimation(){
        this.currentFrame = (this.currentFrame % this.frameCount) + 1;
    }

    draw() {
        canvasContext.save();

        canvasContext.drawImage(
            ghostFrames,
            this.imageX,
            this.imageY,
            this.imageWidth,
            this.imageHeight,
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